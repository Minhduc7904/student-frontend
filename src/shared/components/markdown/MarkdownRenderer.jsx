import { memo, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { markdownService } from '../../../core/services/modules';
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

const looksLikeHtml = (value = '') => /<\/?[a-z][\s\S]*>/i.test(value);

const escapeHtml = (value = '') => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const extractHtmlFromRenderResponse = (payload) => {
    if (!payload) return '';
    if (typeof payload === 'string') return payload;
    if (typeof payload?.html === 'string') return payload.html;
    if (typeof payload?.data?.html === 'string') return payload.data.html;
    if (typeof payload?.data === 'string') return payload.data;
    if (typeof payload?.data?.data?.html === 'string') return payload.data.data.html;
    return '';
};

const sanitizeAndEnhanceHtml = (rawHtml, imgClassNameSize) => {
    const sanitized = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true, svg: true, mathMl: true },
        ADD_TAGS: ['eq'],
        ADD_ATTR: ['class', 'style', 'target', 'rel', 'aria-hidden'],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    });

    if (typeof window === 'undefined') {
        return sanitized;
    }

    const container = window.document.createElement('div');
    container.innerHTML = sanitized;

    const imageClassTokens = ['markdown-image', 'object-contain', ...(imgClassNameSize || '').split(' ').filter(Boolean)];

    container.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src') || '';
        if (!src.trim()) {
            img.remove();
            return;
        }

        img.setAttribute('loading', 'lazy');
        img.classList.add(...imageClassTokens);
    });

    container.querySelectorAll('a').forEach((anchor) => {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noopener noreferrer');
        anchor.classList.add('markdown-link');
    });

    return container.innerHTML;
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
    imgClassNameSize = 'max-w-full max-h-[600px]',
    allowRawHtml = true,
    breaks = true,
}) => {
    if (!content) {
        return null;
    }

    const isLegacyIOS = isLegacyIOSVersion();
    const isHtmlContent = looksLikeHtml(content);

    const [renderedHtml, setRenderedHtml] = useState('');

    useEffect(() => {
        let isMounted = true;

        const renderContent = async () => {
            // HTML input: sanitize and render directly.
            if (isHtmlContent) {
                const safeHtml = sanitizeAndEnhanceHtml(content, imgClassNameSize);
                if (isMounted) {
                    setRenderedHtml(safeHtml);
                }
                return;
            }

            // Markdown input: delegate parsing to backend, then sanitize result.
            try {
                const response = await markdownService.renderMarkdownToHtml(content, {
                    allowRawHtml,
                    breaks,
                });
                const htmlFromApi = extractHtmlFromRenderResponse(response);
                const fallbackHtml = `<p>${escapeHtml(content).replaceAll('\n', '<br />')}</p>`;
                const htmlToRender = htmlFromApi || fallbackHtml;
                const safeHtml = sanitizeAndEnhanceHtml(htmlToRender, imgClassNameSize);

                if (isMounted) {
                    setRenderedHtml(safeHtml);
                }
            } catch {
                const fallbackHtml = `<p>${escapeHtml(content).replaceAll('\n', '<br />')}</p>`;
                const safeHtml = sanitizeAndEnhanceHtml(fallbackHtml, imgClassNameSize);

                if (isMounted) {
                    setRenderedHtml(safeHtml);
                }
            }
        };

        renderContent();

        return () => {
            isMounted = false;
        };
    }, [content, imgClassNameSize, isHtmlContent, isLegacyIOS, allowRawHtml, breaks]);

    const htmlOutput = useMemo(() => renderedHtml, [renderedHtml]);

    return (
        <div className={`markdown-renderer ${className}`}>
            <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
        </div>
    );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

MarkdownRenderer.propTypes = {
    content: PropTypes.string,
    className: PropTypes.string,
    imgClassNameSize: PropTypes.string,
    allowRawHtml: PropTypes.bool,
    breaks: PropTypes.bool,
};

export default MarkdownRenderer;
