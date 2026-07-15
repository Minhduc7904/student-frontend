import { ChevronLeft, ChevronRight } from "lucide-react";

const EnrollmentPagination = ({ pagination, onPrevious, onNext }) => {
    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;
    const hasPrevious = pagination?.hasPrevious ?? currentPage > 1;
    const hasNext = pagination?.hasNext ?? currentPage < totalPages;

    if (totalPages <= 1) return null;

    return (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Phân trang khóa học">
            <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Trang trước"
                title="Trang trước"
            >
                <ChevronLeft size={19} />
            </button>
            <span className="min-w-24 text-center text-sm font-semibold text-gray-600">
                Trang {currentPage} / {totalPages}
            </span>
            <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Trang sau"
                title="Trang sau"
            >
                <ChevronRight size={19} />
            </button>
        </nav>
    );
};

export default EnrollmentPagination;
