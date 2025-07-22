import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Bot } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-base dark:prose-invert max-w-none space-y-4">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Enhanced heading styles using design system
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground border-b-2 border-primary/30 pb-3 flex items-center gap-3 first:mt-0">
              <Bot className="h-6 w-6 text-primary flex-shrink-0" />
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 mt-6 text-foreground border-l-4 border-primary pl-4 bg-primary/5 py-2 rounded-r-lg first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 mt-4 text-foreground flex items-center gap-2 first:mt-0">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium mb-2 mt-3 text-foreground first:mt-0">
              {children}
            </h4>
          ),

          // Enhanced paragraph styling
          p: ({ children }) => (
            <p className="text-foreground leading-7 mb-6 text-base font-normal tracking-wide">
              {children}
            </p>
          ),

          // Enhanced strong/bold text using design system
          strong: ({ children }) => (
            <strong className="font-semibold text-primary bg-primary/10 px-1 py-0.5 rounded text-sm">
              {children}
            </strong>
          ),

          // Enhanced emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-muted-foreground font-medium">
              {children}
            </em>
          ),

          // Enhanced list styling
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4 pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 pl-4 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90 leading-relaxed flex items-start gap-3 text-sm mb-2 font-medium">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="flex-1">{children}</span>
            </li>
          ),

          // Enhanced table styling
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-primary/20">
              <table className="w-full border-collapse bg-background/50 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-primary/10 to-primary/5">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-primary/20 px-3 py-2 text-left font-semibold text-primary text-xs">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-primary/20 px-3 py-2 text-foreground text-xs">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-primary/5 transition-colors">
              {children}
            </tr>
          ),

          // Enhanced code styling
          code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground border">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto border border-primary/20 my-3 text-xs">
              {children}
            </pre>
          ),

          // Enhanced blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-3 py-2 bg-primary/5 rounded-r-lg my-3 italic text-muted-foreground text-sm">
              {children}
            </blockquote>
          ),

          // Enhanced horizontal rule
          hr: () => (
            <hr className="border-primary/30 my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;