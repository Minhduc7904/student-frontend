/**
 * Markdown Service
 * Handles markdown rendering via backend
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

/**
 * Render markdown content to HTML on backend.
 * @param {string} content - Markdown content
 * @param {Object} [options] - Render options
 * @param {boolean} [options.allowRawHtml=true] - Allow raw HTML in markdown
 * @param {boolean} [options.breaks=true] - Convert line breaks to <br>
 * @returns {Promise<Object|string>} HTML render response
 */
export async function renderMarkdownToHtml(content, options = {}) {
    const { allowRawHtml = true, breaks = true } = options;

    const response = await axiosClient.post(API_ENDPOINTS.MARKDOWN.RENDER_HTML, {
        content,
        allowRawHtml,
        breaks,
    });
    return response;
}

export const markdownService = {
    renderMarkdownToHtml,
};

export default markdownService;
