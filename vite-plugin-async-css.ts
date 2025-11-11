import type { Plugin } from 'vite';

/**
 * Vite plugin to make CSS non-render-blocking
 * Converts <link rel="stylesheet"> to load asynchronously using the media print trick
 */
export default function asyncCssPlugin(): Plugin {
    return {
        name: 'vite-plugin-async-css',
        apply: 'build', // Only apply during production build
        transformIndexHtml: {
            order: 'post',
            handler(html) {
                // Transform all stylesheet links to load asynchronously
                return html.replace(
                    /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)"\s*\/?>/g,
                    (_match, href) => {
                        // Use the media="print" trick for async CSS loading
                        // This loads CSS without blocking render, then applies it when loaded
                        return `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'; this.onload=null;">
<noscript><link rel="stylesheet" href="${href}"></noscript>`;
                    }
                );
            }
        }
    };
}
