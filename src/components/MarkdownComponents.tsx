import { type Components } from 'react-markdown';



// Define markdown components with correct typing
const MarkdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeString);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    };

    if (match) {
      return (
        <div className="relative group">
          <button
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 px-2 py-1 rounded text-sm"
            onClick={handleCopy}
          >
            Copy
          </button>
          <pre className={className}>
            <code className={className} {...props}>{children}</code>
          </pre>
        </div>
      );
    }

    return (
      <code className={className} {...props}>{children}</code>
    );
  },

  a({ href, children, ...props }) {
    const isInternal = href?.startsWith('#');
    return (
      <a
        href={href}
        className="text-primary hover:text-primary/80 no-underline hover:underline"
        target={isInternal ? undefined : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
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
        className="max-w-full h-auto rounded-lg shadow-md my-4"
        loading="lazy"
        {...props}
      />
    );
  },

  h1: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h1 id={id} className="scroll-mt-24">{children}</h1>;
  },
  h2: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h2 id={id} className="scroll-mt-24">{children}</h2>;
  },
  h3: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h3 id={id} className="scroll-mt-24">{children}</h3>;
  },
  h4: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return <h4 id={id} className="scroll-mt-24">{children}</h4>;
  },

};

export default MarkdownComponents;
