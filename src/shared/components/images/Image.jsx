/**
 * Image Component
 * Reusable image component with fallback, lazy loading, and error handling
 */

import PropTypes from 'prop-types';
import { useImage, useLazyImage } from '@/shared/hooks';
import { DEFAULT_IMAGES } from '@/shared/constants';

/**
 * Standard Image Component
 */
export function Image({
    src,
    alt = '',
    fallback = DEFAULT_IMAGES.NO_IMAGE,
    className = '',
    loading = 'eager',
    onLoad,
    onError,
    ...props
}) {
    const { src: imgSrc, loading: isLoading, error } = useImage(src, fallback);

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            <img
                src={imgSrc}
                alt={alt}
                className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                loading={loading}
                onLoad={onLoad}
                onError={onError}
                {...props}
            />
            {error && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Failed to load</span>
                </div>
            )}
        </div>
    );
}

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.oneOf(['eager', 'lazy']),
    onLoad: PropTypes.func,
    onError: PropTypes.func,
};

/**
 * Lazy Loaded Image Component
 */
export function LazyImage({
    src,
    alt = '',
    fallback = DEFAULT_IMAGES.NO_IMAGE,
    className = '',
    placeholder,
    onLoad,
    ...props
}) {
    const { src: imgSrc, inView, ref } = useLazyImage(src);
    const { src: finalSrc, loading, error } = useImage(inView ? imgSrc : placeholder, fallback);

    return (
        <div ref={ref} className={`relative ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            {inView && (
                <img
                    src={finalSrc}
                    alt={alt}
                    className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    onLoad={onLoad}
                    {...props}
                />
            )}
            {error && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Failed to load</span>
                </div>
            )}
        </div>
    );
}

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onLoad: PropTypes.func,
};

/**
 * Avatar Image Component
 */
export function Avatar({
    src,
    alt = '',
    size = 'md',
    fallback = DEFAULT_IMAGES.USER_AVATAR,
    className = '',
    ...props
}) {
    const sizeClasses = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
        '2xl': 'w-20 h-20',
    };

    const { src: imgSrc, loading, error } = useImage(src, fallback);

    return (
        <div className={`relative ${sizeClasses[size]} ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
            )}
            <img
                src={imgSrc}
                alt={alt}
                className={`w-full h-full object-cover rounded-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                {...props}
            />
            {error && (
                <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
}

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
    fallback: PropTypes.string,
    className: PropTypes.string,
};

/**
 * Background Image Component
 */
export function BackgroundImage({
    src,
    fallback = DEFAULT_IMAGES.NO_IMAGE,
    className = '',
    overlay = false,
    overlayClass = 'bg-black/50',
    children,
    ...props
}) {
    const { src: imgSrc } = useImage(src, fallback);

    return (
        <div
            className={`relative bg-cover bg-center bg-no-repeat ${className}`}
            style={{ backgroundImage: `url(${imgSrc})` }}
            {...props}
        >
            {overlay && <div className={`absolute inset-0 ${overlayClass}`} />}
            {children && <div className="relative z-10">{children}</div>}
        </div>
    );
}

BackgroundImage.propTypes = {
    src: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string,
    overlay: PropTypes.bool,
    overlayClass: PropTypes.string,
    children: PropTypes.node,
};

/**
 * Responsive Image Component with srcset
 */
export function ResponsiveImage({
    src,
    srcSet,
    sizes,
    alt = '',
    fallback = DEFAULT_IMAGES.NO_IMAGE,
    className = '',
    ...props
}) {
    const { src: imgSrc, loading, error } = useImage(src, fallback);

    return (
        <div className={`relative ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
            )}
            <img
                src={imgSrc}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                {...props}
            />
            {error && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Failed to load</span>
                </div>
            )}
        </div>
    );
}

ResponsiveImage.propTypes = {
    src: PropTypes.string.isRequired,
    srcSet: PropTypes.string,
    sizes: PropTypes.string,
    alt: PropTypes.string,
    fallback: PropTypes.string,
    className: PropTypes.string,
};

export default Image;
