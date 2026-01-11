"use client";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
    content: string;
}

export default function LatexRenderer({ content }: LatexRendererProps) {
    return (
        <div className="latex-content prose prose-sm dark:prose-invert max-w-none 
            prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
            prose-headings:my-3 prose-strong:text-inherit">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
