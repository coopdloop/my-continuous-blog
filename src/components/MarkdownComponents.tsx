import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type Components } from 'react-markdown';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CSSProperties } from 'react';

interface CodeProps {
    node?: any,
    inline?: any,
    className?: any,
    children?: any,
}

// Define a set of commonly used languages in your blog
const commonLanguages = {
  javascript: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  typescript: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  jsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  tsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
  css: () => import('react-syntax-highlighter/dist/esm/languages/prism/css'),
  json: () => import('react-syntax-highlighter/dist/esm/languages/prism/json'),
  markdown: () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
  bash: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  python: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
};

// Register languages asynchronously
Object.entries(commonLanguages).forEach(([language, importFn]) => {
  importFn().then(mod => {
    SyntaxHighlighter.registerLanguage(language, mod.default);
  });
});

// Define markdown components with correct typing
const MarkdownComponents: Components = {
  code(props: CodeProps) {
    const { className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const [copied, setCopied] = useState(false);
    const [_isLanguageLoaded, setIsLanguageLoaded] = useState(false);
    const language = match?.[1] || 'text';

    useEffect(() => {
      if (match && commonLanguages[language as keyof typeof commonLanguages]) {
        commonLanguages[language as keyof typeof commonLanguages]().then(mod => {
          SyntaxHighlighter.registerLanguage(language, mod.default);
          setIsLanguageLoaded(true);
        });
      }
    }, [language]);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    };

    if (match) {
      const customStyle: CSSProperties = {
        margin: 0,
        padding: '1.5rem',
        backgroundColor: 'rgb(40, 44, 52)',
        fontSize: '0.9rem',
      };

      const lineNumberStyle: CSSProperties = {
        minWidth: '2.5em',
        paddingRight: '1em',
        textAlign: 'right',
        userSelect: 'none',
        opacity: 0.5
      };

      return (
        <div className="relative group">
          <button
            className="absolute right-2 top-2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ClipboardIcon className="w-4 h-4" />
            )}
          </button>
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            showLineNumbers={true}
            wrapLongLines={true}
            customStyle={customStyle}
            lineNumberStyle={lineNumberStyle}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className="bg-primary/10 px-1.5 py-0.5 rounded text-sm" {...rest}>
        {children}
      </code>

    );
  },

  a({ href, children, ...props }) {
    const isInternal = href?.startsWith('#');
    return (
      <a
        href={href}
        className={`${isInternal
          ? 'text-primary hover:underline'
          : 'text-primary hover:underline'
          }`}
        {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
      </a>
    );
  },

  img({ src, alt, ...props }) {
    return (
      <img
        src={src}
        alt={alt}
        className="max-w-full md:w-auto rounded-lg h-auto md:max-h-[1000px] shadow-md my-4"
        {...props}
      />
    );
  },

  h1: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h1 id={id} className="text-3xl font-bold mt-8 mb-4">
        {children}
      </h1>
    );
  },

  h2: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h2 id={id} className="text-2xl font-bold mt-8 mb-4">
        {children}
      </h2>
    );
  },

  h3: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h3 id={id} className="text-xl font-bold mt-6 mb-3">
        {children}
      </h3>
    );
  },

  h4: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h4 id={id} className="text-lg font-bold mt-6 mb-3">
        {children}
      </h4>
    );
  },
};

export default MarkdownComponents;
