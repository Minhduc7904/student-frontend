import { Spinner } from './Spinner';

/**
 * Full page loading component
 * Hiển thị loading screen toàn màn hình với logo và message
 */
export const PageLoading = ({
    message = 'Đang tải...',
    showLogo = true,
    backgroundColor = 'bg-background'
}) => {
    return (
        <div className={`fixed inset-0 z-[9999] ${backgroundColor} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-6 px-4">

                {/* Loading Spinner */}
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="xl" color="blue" />

                    {/* Loading Message */}
                    {message && (
                        <div className="text-center">
                            <p className="text-h4 sm:text-h3 text-blue-800 font-semibold mb-2">
                                {message}
                            </p>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Simple page loading - Minimal version
 */
export const SimplePageLoading = ({ message = 'Đang tải...' }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 px-4">
                <Spinner size="xl" color="blue" />
                {message && (
                    <p className="text-h4 text-blue-800">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

/**
 * Content loading - For sections/containers
 */
export const ContentLoading = ({
    message = 'Đang tải nội dung...',
    height = 'h-64'
}) => {
    return (
        <div className={`${height} flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" color="blue" />
                {message && (
                    <p className="text-text-4 text-gray-700">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

/**
 * Skeleton loading for cards/lists
 */
export const SkeletonLoading = ({ count = 3, type = 'card' }) => {
    const items = Array.from({ length: count }, (_, i) => i);

    if (type === 'card') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                    >
                        <div className="h-32 bg-gray-200 rounded mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="space-y-4">
                {items.map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};
