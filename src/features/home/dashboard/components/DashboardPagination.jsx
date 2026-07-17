import { ChevronLeft, ChevronRight } from "lucide-react";

const DashboardPagination = ({ pagination, onPrevious, onNext, label }) => {
    const canGoPrevious = pagination.hasPrevious || pagination.page > 1;
    const canGoNext = pagination.hasNext || pagination.page < pagination.totalPages;

    if (pagination.totalPages <= 1) return null;

    return (
        <nav className="mt-5 flex items-center justify-between gap-2 border-t border-blue-100 pt-4 sm:gap-4" aria-label={`Phân trang ${label}`}>
            <button type="button" onClick={onPrevious} disabled={!canGoPrevious} aria-label="Trang trước" className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-white text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-3"><ChevronLeft size={17} /><span className="hidden sm:inline">Trang trước</span></button>
            <span className="whitespace-nowrap text-xs font-semibold text-gray-600 sm:text-sm">Trang <strong className="text-blue-950">{pagination.page}</strong> / {pagination.totalPages}</span>
            <button type="button" onClick={onNext} disabled={!canGoNext} aria-label="Trang sau" className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-white text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-3"><span className="hidden sm:inline">Trang sau</span><ChevronRight size={17} /></button>
        </nav>
    );
};

export default DashboardPagination;
