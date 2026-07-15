import { Check, Filter, RotateCcw } from "lucide-react";

const ACADEMIC_YEARS = ["2025-2026", "2026-2027", "2027-2028", "2028-2029", "2029-2030"];

const CheckboxFilter = ({ label, checked, onChange }) => (
    <label className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold transition ${checked ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-50"}`}>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${checked ? "border-blue-800 bg-blue-800 text-white" : "border-gray-300 bg-white"}`}>
            {checked ? <Check size={12} strokeWidth={3} /> : null}
        </span>
        <span className="truncate">{label}</span>
    </label>
);

const MarketplaceFilters = ({ filters, subjects, loadingSubjects, onChange, onReset }) => {
    const toggleSingleValue = (field, value) => {
        onChange(field, String(filters[field]) === String(value) ? "" : value);
    };

    return (
        <aside className="h-fit border border-blue-100 bg-white p-4 lg:sticky lg:top-6" aria-label="Bộ lọc khóa học">
            <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-4">
                <h2 className="inline-flex items-center gap-2 text-base font-bold text-blue-950"><Filter size={17} className="text-blue-800" /> Bộ lọc</h2>
                <button type="button" onClick={onReset} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-blue-800 transition hover:text-blue-950">
                    <RotateCcw size={14} />
                    Đặt lại
                </button>
            </div>

            <section className="border-b border-blue-100 py-4">
                <h3 className="text-sm font-bold text-blue-950">Khối lớp</h3>
                <div className="mt-2 grid grid-cols-2 gap-1">
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((grade) => (
                        <CheckboxFilter key={grade} label={`Khối ${grade}`} checked={String(filters.grade) === String(grade)} onChange={() => toggleSingleValue("grade", grade)} />
                    ))}
                </div>
            </section>

            <section className="border-b border-blue-100 py-4">
                <h3 className="text-sm font-bold text-blue-950">Môn học</h3>
                <div className="mt-2 max-h-60 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                    {loadingSubjects ? <p className="px-2.5 py-2 text-sm text-gray-500">Đang tải môn học...</p> : null}
                    {!loadingSubjects && !subjects.length ? <p className="px-2.5 py-2 text-sm text-gray-500">Chưa có môn học.</p> : null}
                    {subjects.map((subject) => (
                        <CheckboxFilter key={subject.subjectId} label={subject.name} checked={String(filters.subjectId) === String(subject.subjectId)} onChange={() => toggleSingleValue("subjectId", subject.subjectId)} />
                    ))}
                </div>
            </section>

            <section className="pt-4">
                <h3 className="text-sm font-bold text-blue-950">Năm học</h3>
                <div className="mt-2 space-y-1">
                    {ACADEMIC_YEARS.map((academicYear) => (
                        <CheckboxFilter key={academicYear} label={academicYear} checked={filters.academicYear === academicYear} onChange={() => toggleSingleValue("academicYear", academicYear)} />
                    ))}
                </div>
            </section>
        </aside>
    );
};

export default MarketplaceFilters;
