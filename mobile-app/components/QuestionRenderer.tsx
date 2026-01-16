import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const htmlContent = (content: string, isDark: boolean = true) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        body {
            background-color: ${isDark ? '#000000' : '#ffffff'};
            color: ${isDark ? '#ffffff' : '#000000'};
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 18px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        p { margin: 0; padding: 0; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${content}
</body>
</html>
`;

export function QuestionRenderer({ content, height = 100 }: { content: string, height?: number }) {
    // Simple check if content contains latex delimiters like $ or $$ or \[
    // If not, might just be text, but Webview is safer for formatting anyway.

    return (
        <View style={{ height, width: '100%', opacity: 0.99 }}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent(content, true) }}
                style={{ backgroundColor: 'transparent' }}
                scrollEnabled={true} // Allow scroll if content is long
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
