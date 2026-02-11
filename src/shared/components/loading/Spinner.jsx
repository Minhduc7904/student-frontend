/**
 * Spinner Component - Loading spinner với nhiều variants và sizes
 */

/**
 * Spinner cơ bản
 */
export const Spinner = ({ 
    size = 'md', 
    color = 'white',
    className = '' 
}) => {
    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
    };

    const colorClasses = {
        white: 'text-white',
        blue: 'text-blue-800',
        gray: 'text-gray-700',
        yellow: 'text-yellow-500',
    };

    return (
        <svg 
            className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

/**
 * Loading text với spinner
 */
export const LoadingText = ({ 
    text = 'Đang tải...', 
    size = 'md',
    color = 'white',
    textClassName = '',
    spinnerClassName = ''
}) => {
    return (
        <div className="flex items-center justify-center gap-2">
            <Spinner size={size} color={color} className={spinnerClassName} />
            <span className={textClassName}>{text}</span>
        </div>
    );
};

/**
 * Loading overlay cho full page hoặc container
 */
export const LoadingOverlay = ({ 
    text = 'Đang tải...', 
    fullScreen = false,
    transparent = false 
}) => {
    const containerClass = fullScreen
        ? 'fixed inset-0 z-50'
        : 'absolute inset-0 z-10';

    const bgClass = transparent
        ? 'bg-black/20'
        : 'bg-white/90';

    return (
        <div className={`${containerClass} ${bgClass} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-4">
                <Spinner size="xl" color="blue" />
                {text && (
                    <p className="text-h4 text-blue-800">{text}</p>
                )}
            </div>
        </div>
    );
};

/**
 * Loading dots animation
 */
export const LoadingDots = ({ color = 'gray' }) => {
    const colorClasses = {
        white: 'bg-white',
        blue: 'bg-blue-800',
        gray: 'bg-gray-700',
        yellow: 'bg-yellow-500',
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce [animation-delay:-0.3s]`} />
            <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce [animation-delay:-0.15s]`} />
            <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} />
        </div>
    );
};

/**
 * Button loading state
 */
export const ButtonLoading = ({ 
    text = 'Đang xử lý...', 
    size = 'md',
    color = 'white' 
}) => {
    return (
        <LoadingText 
            text={text} 
            size={size} 
            color={color}
            textClassName="font-semibold"
        />
    );
};
