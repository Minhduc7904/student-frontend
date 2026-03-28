import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import './markdown-styles.css';

/**
 * ✅ Detect regex feature (NOT userAgent)
 */
const isModernRegexSupported = () => {
    try {
        new RegExp('(?<test>a)');
        return true;
    } catch {
        return false;
    }
};

/**
 * ✅ Safe plugin loader (không bao giờ crash)
 */
const getSafePlugins = () => {
    const safe = isModernRegexSupported();

    if (!safe) {
        return {
            remarkPlugins: [],
            rehypePlugins: [],
        };
    }

    return {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
            rehypeRaw,
            [
                rehypeKatex,
                {
                    strict: false,
                    trust: true,
                    throwOnError: false,
                    errorColor: '#cc0000',
                    output: 'html',
                },
            ],
        ],
    };
};

/**
 * MarkdownRenderer - SAFE VERSION 🚀
 */
export const MarkdownRenderer = memo(({
    content,
    className = '',
    components: customComponents,
    imgClassNameSize = 'max-w-full max-h-[600px]',
}) => {

    if (!content) return null;

    /**
     * ✅ Memo plugin để tránh re-render
     */
    const { remarkPlugins, rehypePlugins } = useMemo(() => {
        return getSafePlugins();
    }, []);

    /**
     * ✅ Safe components
     */
    const defaultComponents = {
        code({ inline, className, children, ...props }) {
            return inline ? (
                <code className="inline-code" {...props}>
                    {children}
                </code>
            ) : (
                <code className={`code-block ${className || ''}`} {...props}>
                    {children}
                </code>
            );
        },

        img({ ...props }) {
            if (!props.src || props.src.trim() === '') return null;

            if (props.src.startsWith('media:')) {
                return (
                    <span className="text-gray-400 italic text-sm">
                        [Hình ảnh: {props.alt || 'Không có mô tả'}]
                    </span>
                );
            }

            return (
                <span className="inline-flex justify-center w-full my-4">
                    <img
                        className={`markdown-image object-contain ${imgClassNameSize}`}
                        loading="lazy"
                        {...props}
                        alt={props.alt || 'Image'}
                    />
                </span>
            );
        },

        table({ ...props }) {
            return (
                <div className="table-wrapper">
                    <table className="markdown-table" {...props} />
                </div>
            );
        },

        a({ ...props }) {
            return (
                <a
                    className="markdown-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                />
            );
        },
    };

    /**
     * ✅ HARD FAILSAFE (quan trọng nhất)
     * Nếu plugin vẫn crash → fallback ngay
     */
    try {
        return (
            <div className={`markdown-renderer ${className}`}>
                <ReactMarkdown
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    components={{
                        ...defaultComponents,
                        ...customComponents,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        );
    } catch (err) {
        console.error('Markdown render failed:', err);

        // 👉 fallback basic (KHÔNG plugin)
        return (
            <div className={`markdown-renderer ${className}`}>
                <ReactMarkdown
                    components={{
                        ...defaultComponents,
                        ...customComponents,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        );
    }
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

MarkdownRenderer.propTypes = {
    content: PropTypes.string,
    className: PropTypes.string,
    components: PropTypes.object,
    imgClassNameSize: PropTypes.string,
};

export default MarkdownRenderer;