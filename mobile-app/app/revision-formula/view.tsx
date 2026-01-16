import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAppColors } from '@/hooks/use-app-colors';
import { ChevronLeft } from 'lucide-react-native';

export default function FormulaViewScreen() {
    const { content, title } = useLocalSearchParams<{ content: string, title: string }>();
    const colors = useAppColors();
    const router = useRouter();

    // HTML Template with KaTeX Support
    // We inject the markdown/latex content into this HTML
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
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                padding: 20px;
                color: ${colors.text};
                background-color: ${colors.bg};
                line-height: 1.6;
            }
            h1 { color: ${colors.primary}; font-size: 24px; border-bottom: 2px solid ${colors.border}; padding-bottom: 10px; margin-top: 0; }
            h2 { color: ${colors.text}; font-size: 20px; margin-top: 25px; border-left: 4px solid ${colors.primary}; padding-left: 10px; }
            h3 { color: ${colors.textSecondary}; font-size: 18px; margin-top: 20px; }
            p { margin-bottom: 15px; font-size: 16px; }
            ul { margin-bottom: 15px; padding-left: 20px; }
            li { margin-bottom: 8px; }
            .katex-display { overflow-x: auto; overflow-y: hidden; padding: 10px 0; }
            code { background: ${colors.cardBgSecondary}; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: ${colors.primary}; }
            blockquote { border-left: 4px solid ${colors.borderLight}; margin: 0; padding-left: 15px; color: ${colors.textSecondary}; font-style: italic; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid ${colors.border}; padding: 10px; text-align: left; }
            th { background-color: ${colors.cardBgSecondary}; font-weight: 600; }
        </style>
    </head>
    <body>
        <div id="content"></div>
        <script>
            // Parse Markdown
            document.getElementById('content').innerHTML = marked.parse(\`${content?.replace(/`/g, '\\`').replace(/\${/g, '\\${') || ''}\`);

            // Render Math
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\\\(', right: '\\\\)', display: false},
                    {left: '\\\\[', right: '\\\\]', display: true}
                ],
                throwOnError : false
            });
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
