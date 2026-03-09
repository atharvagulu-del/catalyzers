import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAppColors } from '@/hooks/use-app-colors';
import { ChevronLeft } from 'lucide-react-native';

// Function to fix LaTeX backslashes before sending to WebView
function normalizeLatex(content: string): string {
    if (!content) return '';

    // The content comes with double backslashes from JS strings (e.g., \\frac)
    // We need single backslashes for KaTeX (e.g., \frac)
    // But we must be careful not to break escaped characters

    let result = content;

    // Replace common LaTeX patterns with proper escaping
    // Convert \\command to \command for KaTeX
    result = result
        // Fix double backslashes to single for LaTeX commands
        .replace(/\\\\/g, '\\')
        // Make sure dollar signs are preserved
        .replace(/\\\$/g, '$');

    return result;
}

export default function FormulaViewScreen() {
    const { content, title } = useLocalSearchParams<{ content: string, title: string }>();
    const colors = useAppColors();
    const router = useRouter();

    // Preprocess the content to fix LaTeX
    const processedContent = useMemo(() => {
        return normalizeLatex(content || '');
    }, [content]);

    // Escape content for safe HTML/JS injection
    const safeContent = useMemo(() => {
        return processedContent
            .replace(/\\/g, '\\\\')  // Escape backslashes for JS string
            .replace(/`/g, '\\`');   // Escape backticks only - keep $ for LaTeX
    }, [processedContent]);

    // HTML Template with KaTeX Support
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                padding: 20px;
                margin: 0;
                color: ${colors.text};
                background-color: ${colors.bg};
                line-height: 1.7;
                font-size: 16px;
            }
            h1 { 
                color: ${colors.primary}; 
                font-size: 22px; 
                border-bottom: 2px solid ${colors.border}; 
                padding-bottom: 12px; 
                margin-top: 0;
                margin-bottom: 20px;
            }
            h2 { 
                color: ${colors.text}; 
                font-size: 18px; 
                margin-top: 28px;
                margin-bottom: 12px;
                border-left: 4px solid ${colors.primary}; 
                padding-left: 12px;
                font-weight: 600;
            }
            h3 { 
                color: ${colors.textSecondary}; 
                font-size: 16px; 
                margin-top: 20px;
                font-weight: 600;
            }
            p { margin-bottom: 12px; }
            ul, ol { 
                margin-bottom: 16px; 
                padding-left: 24px;
            }
            li { 
                margin-bottom: 8px;
                line-height: 1.6;
            }
            
            /* KaTeX Styling */
            .katex { font-size: 1.1em !important; }
            .katex-display { 
                overflow-x: auto; 
                overflow-y: hidden; 
                padding: 16px 0;
                margin: 12px 0;
            }
            .katex-display > .katex {
                white-space: normal;
            }
            
            /* Table styling */
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 16px 0;
                font-size: 14px;
            }
            th, td { 
                border: 1px solid ${colors.border}; 
                padding: 10px; 
                text-align: left;
            }
            th { 
                background-color: ${colors.cardBgSecondary || colors.border}; 
                font-weight: 600;
            }
            
            /* Code styling */
            code { 
                background: ${colors.cardBgSecondary || '#f1f5f9'}; 
                padding: 2px 6px; 
                border-radius: 4px; 
                font-family: monospace;
                font-size: 14px;
            }
            
            strong { font-weight: 600; }
        </style>
    </head>
    <body>
        <div id="content"></div>
        <script>
            try {
                // The content with proper escaping
                var rawContent = \`${safeContent}\`;
                
                // Parse Markdown first
                document.getElementById('content').innerHTML = marked.parse(rawContent);
                
                // Then render math with KaTeX
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false,
                    trust: true
                });
            } catch(e) {
                document.getElementById('content').innerHTML = '<p style="color: red;">Error rendering content: ' + e.message + '</p>';
            }
        </script>
    </body>
    </html>
    `;

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Header */}
            <View style={{
                paddingTop: 60,
                paddingHorizontal: 20,
                paddingBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardBg,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                zIndex: 10
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        marginRight: 16,
                        padding: 8,
                        borderRadius: 20,
                        backgroundColor: colors.iconBg || colors.borderLight
                    }}
                >
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.text,
                    flex: 1
                }} numberOfLines={1}>
                    {title || 'Formula View'}
                </Text>
            </View>

            <View style={{ flex: 1, position: 'relative' }}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    style={{ flex: 1, backgroundColor: colors.bg }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
