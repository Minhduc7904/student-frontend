import { memo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import './markdown-styles.css';

const isLegacyIOSVersion = () => {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent || '';
    const isIOSDevice = /iP(hone|od|ad)/i.test(ua)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (!isIOSDevice) return false;

    const versionMatch = ua.match(/OS (\d+)_?(\d+)?_?(\d+)?/i);
    if (!versionMatch) return false;

    const major = Number(versionMatch[1] || 0);
    const minor = Number(versionMatch[2] || 0);

    return major < 16 || (major === 16 && minor < 3);
};

/**
 * MarkdownRenderer Component
 *
 * A reusable component for rendering markdown content with support for:
 * - GitHub Flavored Markdown (tables, strikethrough, task lists)
 * - Math equations (KaTeX)
 * - Raw HTML
 * - Syntax highlighting
 * - Custom styling
 *
 * @param {string} content - Markdown content to render
 * @param {string} className - Additional CSS classes
 * @param {object} components - Custom component renderers
 * @param {string} imgClassNameSize - Tailwind size classes for images
 */
export const MarkdownRenderer = memo(({
    content,
    className = '',
    components: customComponents,
    imgClassNameSize = 'max-w-full max-h-[600px]',
}) => {
    if (!content) {
        return null;
    }

    const isLegacyIOS = isLegacyIOSVersion();

    // Legacy iOS Safari (<16.3) can crash on some regex used by remark/rehype plugins.
    const remarkPlugins = isLegacyIOS ? [] : [remarkGfm, remarkMath];
    const rehypePlugins = isLegacyIOS
        ? []
        : [
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
        ];

    const defaultComponents = {
        // Custom rendering for code blocks
        code({ node, inline, className, children, ...props }) {
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
        // Custom rendering for images
        img({ node, ...props }) {
            // Skip rendering if src is empty or invalid
            if (!props.src || props.src.trim() === '') {
                return null;
            }

            // Skip rendering media: protocol (these are placeholders)
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
        // Custom rendering for tables
        table({ node, ...props }) {
            return (
                <div className="table-wrapper">
                    <table className="markdown-table" {...props} />
                </div>
            );
        },
        // Custom rendering for links
        a({ node, ...props }) {
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
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

MarkdownRenderer.propTypes = {
    content: PropTypes.string,
    className: PropTypes.string,
    components: PropTypes.object,
    imgClassNameSize: PropTypes.string,
};

export default MarkdownRenderer;
