/**
 * useImage Hook
 * Custom hook for image handling with error fallback
 */

import { useState, useEffect } from 'react';
import { DEFAULT_IMAGES } from '@/shared/constants';

/**
 * Hook to handle image loading with fallback
 * @param {string} src - Image source URL
 * @param {string} fallback - Fallback image URL
 * @returns {Object} { src, loading, error, retry }
 */
export function useImage(src, fallback = DEFAULT_IMAGES.NO_IMAGE) {
    const [imgSrc, setImgSrc] = useState(src);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) {
            setImgSrc(fallback);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(false);

        const img = new Image();
        
        img.onload = () => {
            setImgSrc(src);
            setLoading(false);
            setError(false);
        };

        img.onerror = () => {
            setImgSrc(fallback);
            setLoading(false);
            setError(true);
        };

        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, fallback]);

    const retry = () => {
        setImgSrc(src);
        setLoading(true);
        setError(false);
    };

    return {
        src: imgSrc,
        loading,
        error,
        retry,
    };
}

/**
 * Hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} { src, inView, ref }
 */
export function useLazyImage(src, options = {}) {
    const [inView, setInView] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [ref, setRef] = useState(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    setImgSrc(src);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px',
                ...options,
            }
        );

        observer.observe(ref);

        return () => {
            if (ref) {
                observer.unobserve(ref);
            }
        };
    }, [ref, src, options]);

    return {
        src: imgSrc,
        inView,
        ref: setRef,
    };
}

/**
 * Hook for preloading images
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {Object} { loaded, progress }
 */
export function usePreloadImages(urls = []) {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!urls.length) {
            setLoaded(true);
            return;
        }

        let loadedCount = 0;

        const promises = urls.map((url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                
                img.onload = () => {
                    loadedCount++;
                    setProgress((loadedCount / urls.length) * 100);
                    resolve(url);
                };
                
                img.onerror = () => reject(url);
                
                img.src = url;
            });
        });

        Promise.allSettled(promises).then(() => {
            setLoaded(true);
        });
    }, [urls]);

    return {
        loaded,
        progress,
    };
}

export default useImage;
