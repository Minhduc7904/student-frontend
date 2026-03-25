import { memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    disabled = false,
    className = '',
}) => {
    const items = useMemo(() => {
        if (totalPages <= 1) return [];

        if (totalPages <= 4) {
            return Array.from({ length: totalPages }, (_, idx) => idx + 1);
        }

        if (currentPage <= 4) {
            const firstGroup = [1, 2, 3, 4].filter((item) => item < totalPages);
            return [...firstGroup, 'ellipsis-right', totalPages];
        }

        const middlePages = [currentPage, currentPage + 1]
            .filter((item, idx, arr) => item < totalPages && arr.indexOf(item) === idx);

        if (!middlePages.length) {
            return [1, 'ellipsis-left', totalPages - 1, totalPages];
        }

        return [1, 'ellipsis-left', ...middlePages, 'ellipsis-right', totalPages];
    }, [currentPage, totalPages]);

    if (items.length === 0) return null;

    return (
        <div className={`flex items-center justify-center gap-1.5 ${className}`}>
            <button
                type="button"
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={disabled || currentPage <= 1}
                className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-subhead-5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft size={14} />
            </button>

            {items.map((item, index) => {
                if (typeof item === 'string' && item.includes('ellipsis')) {
                    return (
                        <span key={`${item}-${index}`} className="px-2 text-text-5 text-gray-500">
                            ...
                        </span>
                    );
                }

                const pageNumber = Number(item);
                const isActive = pageNumber === currentPage;

                return (
                    <button
                        key={pageNumber}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPageChange?.(pageNumber)}
                        className={`inline-flex h-7 w-7 items-center justify-center cursor-pointer rounded-lg border text-subhead-5 font-semibold transition-colors ${isActive
                                ? 'border-blue-cyan bg-blue-cyan text-white'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                type="button"
                onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                disabled={disabled || currentPage >= totalPages}
                className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-subhead-5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronRight size={14} />
            </button>
        </div>
    );
};

export default memo(Pagination);
export { Pagination };
