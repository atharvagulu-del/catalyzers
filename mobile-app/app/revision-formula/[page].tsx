import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ChevronLeft, ChevronRight as ChevronRightIcon, RotateCw } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { useAppColors } from '@/hooks/use-app-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PdfViewerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colors = useAppColors();
    const pageStart = parseInt(params.page as string, 10) || 1;
    const pageEnd = parseInt(params.pageEnd as string, 10) || pageStart;
    const title = (params.title as string) || 'Formula';

    const [currentPage, setCurrentPage] = useState(pageStart);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [webviewError, setWebviewError] = useState<string | null>(null);
    const webViewRef = useRef<WebView>(null);

    const totalChapterPages = pageEnd - pageStart + 1;
    const pageInChapter = currentPage - pageStart + 1;

    // Load local PDF as Base64 on mount
    useEffect(() => {
        const loadPdf = async () => {
            try {
                // 1. Resolve asset
                const exampleAsset = require('@/assets/formula-booklet.pdf');
                const asset = Asset.fromModule(exampleAsset);
                await asset.downloadAsync(); // Ensure it's downloaded/cached

                if (!asset.localUri) {
                    throw new Error("Could not resolve local URI for PDF asset");
                }

                // 2. Read as Base64
                const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
                    encoding: 'base64',
                });
                console.log("PDF loaded, length:", base64.length);
                setPdfBase64(base64);
            } catch (error: any) {
                console.error("Error loading PDF asset:", error);
                setWebviewError(error.message || "Failed to load PDF file");
            } finally {
                setIsLoading(false);
            }
        };

        loadPdf();
    }, []);

    // HTML to run PDF.js inside WebView
    // Uses CDN for PDF.js library logic but data is local
    const pdfHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <script>
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        </script>
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                background-color: ${colors.bg}; 
                display: flex; 
                justify-content: center; 
                align-items: flex-start;
                min-height: 100vh; 
            }
            #the-canvas { 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
                width: 100%; 
                height: auto; 
                background-color: white;
            }
            .container { 
                padding: 10px; 
                width: 100%; 
                box-sizing: border-box; 
                display: flex; 
                justify-content: center; 
            }
            .error { color: red; padding: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <canvas id="the-canvas"></canvas>
            <div id="error-msg" class="error" style="display:none"></div>
        </div>
        <script>
            const pdfData = atob("${pdfBase64 || ''}");
            
            async function renderPage(num) {
                try {
                    const loadingTask = pdfjsLib.getDocument({data: pdfData});
                    const pdf = await loadingTask.promise;
                    const page = await pdf.getPage(num);
                    
                    const scale = 2.0; // Higher scale for clear text
                    const viewport = page.getViewport({scale: scale});
                    const canvas = document.getElementById('the-canvas');
                    const context = canvas.getContext('2d');
                    
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    await page.render(renderContext).promise;
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'success'}));
                } catch (err) {
                    document.getElementById('error-msg').innerText = err.message;
                    document.getElementById('error-msg').style.display = 'block';
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: err.message}));
                }
            }

            if ("${pdfBase64 ? 'yes' : 'no'}" === 'yes') {
                renderPage(${currentPage});
            }
        </script>
    </body>
    </html>
    `;

    const goToPrevPage = () => {
        if (currentPage > pageStart) setCurrentPage(prev => prev - 1);
    };

    const goToNextPage = () => {
        if (currentPage < pageEnd) setCurrentPage(prev => prev + 1);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            {/* Header */}
            <View style={{
                paddingTop: 50,
                paddingHorizontal: 16,
                paddingBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#1F2937'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: '#1F2937', padding: 10, borderRadius: 20, marginRight: 12 }}>
                    <ChevronLeft size={22} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>{title}</Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>Page {pageInChapter} of {totalChapterPages}</Text>
                </View>
                {/* Manual Refresh if needed */}
                <TouchableOpacity onPress={() => setCurrentPage(x => x)} style={{ padding: 8 }}>
                    <RotateCw size={18} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* PDF View */}
            <View style={{ flex: 1, backgroundColor: colors.bg }}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={{ color: colors.textSecondary, marginTop: 12 }}>Loading PDF...</Text>
                    </View>
                ) : webviewError || !pdfBase64 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
                        <Text style={{ color: colors.error, fontWeight: '700' }}>Error Loading PDF</Text>
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>{webviewError || "No data"}</Text>
                    </View>
                ) : (
                    <WebView
                        key={currentPage} // Force re-mount on page change to re-run script
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: pdfHtml }}
                        style={{ flex: 1, backgroundColor: 'transparent' }}
                        onMessage={(event) => {
                            try {
                                const data = JSON.parse(event.nativeEvent.data);
                                if (data.type === 'error') {
                                    console.error("WebView Error:", data.message);
                                    // setWebviewError(data.message); // Optional: show error to user
                                }
                            } catch (e) { }
                        }}
                    />
                )}
            </View>

            {/* Bottom Controls */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                paddingBottom: 32,
                backgroundColor: '#111827',
                borderTopWidth: 1,
                borderTopColor: '#1F2937'
            }}>
                <TouchableOpacity
                    onPress={goToPrevPage}
                    disabled={currentPage <= pageStart}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: currentPage <= pageStart ? '#1F2937' : '#3B82F6',
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 12,
                        opacity: currentPage <= pageStart ? 0.3 : 1
                    }}
                >
                    <ChevronLeft size={20} color="white" />
                    <Text style={{ color: 'white', fontWeight: '600', marginLeft: 4 }}>Prev</Text>
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                        {pageInChapter} <Text style={{ color: '#6B7280', fontSize: 14 }}>/ {totalChapterPages}</Text>
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={goToNextPage}
                    disabled={currentPage >= pageEnd}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: currentPage >= pageEnd ? '#1F2937' : '#3B82F6',
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 12,
                        opacity: currentPage >= pageEnd ? 0.3 : 1
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: '600', marginRight: 4 }}>Next</Text>
                    <ChevronRightIcon size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
