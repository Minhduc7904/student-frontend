import { memo, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import './markdown-styles.css';

/**
 * ✅ Detect regex support (critical)
 */
const isModernRegexSupported = () => {
    try {
        new RegExp('(?<test>a)');
        return true;
    } catch {
        return false;
    }
};

export const MarkdownRenderer = memo(({
    content,
    className = '',
    components: customComponents,
    imgClassNameSize = 'max-w-full max-h-[600px]',
}) => {

    const [plugins, setPlugins] = useState({
        remarkPlugins: [],
        rehypePlugins: [],
        loaded: false,
    });

    /**
     * 🚀 Dynamic load plugin (KHÔNG crash iOS)
     */
    useEffect(() => {
        let isMounted = true;

        const loadPlugins = async () => {
            // ❌ Không support regex → skip luôn
            if (!isModernRegexSupported()) {
                if (isMounted) {
                    setPlugins({
                        remarkPlugins: [],
                        rehypePlugins: [],
                        loaded: true,
                    });
                }
                return;
            }

            try {
                const [
                    remarkGfm,
                    remarkMath,
                    rehypeKatex,
                    rehypeRaw
                ] = await Promise.all([
                    import('remark-gfm'),
                    import('remark-math'),
                    import('rehype-katex'),
                    import('rehype-raw'),
                ]);

                if (!isMounted) return;

                setPlugins({
                    remarkPlugins: [remarkGfm.default, remarkMath.default],
                    rehypePlugins: [
                        rehypeRaw.default,
                        [
                            rehypeKatex.default,
                            {
                                strict: false,
                                trust: true,
                                throwOnError: false,
                                errorColor: '#cc0000',
                                output: 'html',
                            },
                        ],
                    ],
                    loaded: true,
                });
            } catch (err) {
                console.error('Plugin load failed:', err);

                if (isMounted) {
                    setPlugins({
                        remarkPlugins: [],
                        rehypePlugins: [],
                        loaded: true,
                    });
                }
            }
        };

        loadPlugins();

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * ✅ Default components (giữ nguyên logic bạn)
     */
    const defaultComponents = useMemo(() => ({
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
    }), [imgClassNameSize]);

    if (!content) return null;

    /**
     * 🔥 HARD FAILSAFE render
     */
    try {
        return (
            <div className={`markdown-renderer ${className}`}>
                <ReactMarkdown
                    remarkPlugins={plugins.remarkPlugins}
                    rehypePlugins={plugins.rehypePlugins}
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
        console.error('Markdown render crashed:', err);

        // 👉 fallback safe (no plugin)
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