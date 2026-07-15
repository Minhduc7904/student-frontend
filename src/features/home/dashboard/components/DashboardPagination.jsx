import { ChevronLeft, ChevronRight } from "lucide-react";

const DashboardPagination = ({ pagination, onPrevious, onNext, label }) => {
    const canGoPrevious = pagination.hasPrevious || pagination.page > 1;
    const canGoNext = pagination.hasNext || pagination.page < pagination.totalPages;

    if (pagination.totalPages <= 1) return null;

    return (
        <nav className="mt-5 flex items-center justify-between gap-4 border-t border-blue-100 pt-4" aria-label={`Phân trang ${label}`}>
            <button type="button" onClick={onPrevious} disabled={!canGoPrevious} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-blue-100 bg-white px-3 text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45"><ChevronLeft size={17} /> Trang trước</button>
            <span className="text-sm font-semibold text-gray-600">Trang <strong className="text-blue-950">{pagination.page}</strong> / {pagination.totalPages}</span>
            <button type="button" onClick={onNext} disabled={!canGoNext} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-blue-100 bg-white px-3 text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45">Trang sau <ChevronRight size={17} /></button>
        </nav>
    );
};

export default DashboardPagination;
