import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathMessageProps {
    content: string;
    textColor: string;
    bgColor?: string;
}

// Detects if content has LaTeX formulas
const hasLatex = (text: string): boolean => {
    return /\$.*?\$/.test(text) || /\$\$.*?\$\$/.test(text);
};

// Renders markdown+LaTeX content using WebView with KaTeX
export function MathMessage({ content, textColor, bgColor = 'transparent' }: MathMessageProps) {
    const { width } = useWindowDimensions();
    const containsLatex = useMemo(() => hasLatex(content), [content]);

    // If no LaTeX, render as plain text for better performance
    if (!containsLatex) {
        return (
            <Text style={{ color: textColor, fontSize: 15, lineHeight: 22 }}>
                {content}
            </Text>
        );
    }

    // Escape content for HTML
    const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" crossorigin="anonymous"></script>
            <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body {
                    background-color: ${bgColor};
                    height: auto;
                    overflow: hidden;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 15px;
                    line-height: 1.5;
                    color: ${textColor};
                    padding: 0;
                }
                .content {
                    word-wrap: break-word;
                }
                .katex {
                    font-size: 1.1em;
                }
                strong, b {
                    font-weight: 600;
                }
                ul, ol {
                    padding-left: 20px;
                    margin: 8px 0;
                }
                li {
                    margin-bottom: 4px;
                }
            </style>
        </head>
        <body>
            <div class="content" id="math-content">${escapedContent}</div>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    if (typeof renderMathInElement !== 'undefined') {
                        renderMathInElement(document.getElementById('math-content'), {
                            delimiters: [
                                {left: '$$', right: '$$', display: true},
                                {left: '$', right: '$', display: false}
                            ],
                            throwOnError: false
                        });
                    }
                    // Send height to React Native
                    setTimeout(() => {
                        const height = document.body.scrollHeight;
                        window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
                    }, 100);
                });
            </script>
        </body>
        </html>
    `;

    const [webViewHeight, setWebViewHeight] = React.useState(100);

    return (
        <WebView
            source={{ html }}
            style={{
                width: width - 120,
                height: webViewHeight,
                backgroundColor: 'transparent'
            }}
            scrollEnabled={false}
            originWhitelist={['*']}
            onMessage={(event) => {
                try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.height) {
                        setWebViewHeight(Math.max(data.height + 10, 50));
                    }
                } catch { }
            }}
        />
    );
}

export default MathMessage;
