import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Components } from 'react-markdown';
import { createHighlighter, type Highlighter } from 'shiki';

interface CodeProps {
    node?: any,
    inline?: any,
    className?: string,
    children?: React.ReactNode,
    [key: string]: any
}

let highlighter: Highlighter | null = null;

// Initialize Shiki highlighter
const getHighlighter = async (): Promise<Highlighter> => {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['one-dark-pro'],
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'python',
        'bash',
        'json',
        'css',
        'html',
        'markdown',
        'sql',
        'yaml',
        'docker',
        'rust',
        'go',
        'java',
        'c',
        'cpp',
        'csharp',
        'php',
        'ruby'
      ]
    });
  }
  return highlighter;
};

// Define markdown components with correct typing
const MarkdownComponents: Components = {
  code(props: CodeProps) {
    const { className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string>('');
    const language = match?.[1] || 'text';

    useEffect(() => {
      const highlightCode = async () => {
        try {
          const hl = await getHighlighter();
          const html = hl.codeToHtml(codeString, {
            lang: language,
            theme: 'one-dark-pro'
          });
          setHighlightedCode(html);
        } catch (error) {
          console.warn(`Failed to highlight code for language ${language}:`, error);
          // Fallback to plain code
          setHighlightedCode(`<pre><code>${codeString}</code></pre>`);
        }
      };

      if (match) {
        highlightCode();
      } else {
        setHighlightedCode(`<pre><code>${codeString}</code></pre>`);
      }
    }, [codeString, language, match]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    };

    if (!match) {
      return (
        <code className="px-1 py-0.5 bg-gray-800 text-gray-300 rounded text-sm font-mono" {...rest}>
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <ClipboardIcon className="w-4 h-4" />
          )}
        </button>
        <div
          className="[&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-4 [&>pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    );
  }
};

export default MarkdownComponents;
