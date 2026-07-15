import { ChevronLeft, ChevronRight } from "lucide-react";

const MarketplacePagination = ({ pagination, onPageChange }) => {
    const page = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;
    const hasPrevious = pagination?.hasPrevious ?? page > 1;
    const hasNext = pagination?.hasNext ?? page < totalPages;

    if (totalPages <= 1) return null;

    return (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Phân trang khóa học mua">
            <button type="button" onClick={() => onPageChange(page - 1)} disabled={!hasPrevious} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40" title="Trang trước" aria-label="Trang trước">
                <ChevronLeft size={19} />
            </button>
            <span className="min-w-28 text-center text-sm font-bold text-gray-600">Trang {page} / {totalPages}</span>
            <button type="button" onClick={() => onPageChange(page + 1)} disabled={!hasNext} className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40" title="Trang sau" aria-label="Trang sau">
                <ChevronRight size={19} />
            </button>
        </nav>
    );
};

export default MarketplacePagination;
