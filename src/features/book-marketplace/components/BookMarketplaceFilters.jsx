import { Check, Filter, RotateCcw } from 'lucide-react';

const BookMarketplaceFilters = ({ filters, categories, loadingCategories, onChange, onToggleCategory, onReset }) => (
    <aside className="h-fit rounded-2xl border border-blue-100 bg-white p-4 lg:sticky lg:top-6" aria-label="Bộ lọc sách">
        <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-4">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-blue-950"><Filter size={17} className="text-blue-800" /> Bộ lọc</h2>
            <button type="button" onClick={onReset} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-blue-800 transition hover:text-blue-950"><RotateCcw size={14} /> Đặt lại</button>
        </div>

        <section className="border-b border-blue-100 py-4">
            <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-blue-950">Loại sách</h3>{filters.categorySlugs?.length ? <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">Đã chọn {filters.categorySlugs.length}</span> : null}</div>
            <p className="mt-1 text-xs leading-5 text-gray-500">Có thể chọn nhiều loại sách.</p>
            <div className="mt-2 max-h-64 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                {loadingCategories ? <p className="px-2.5 py-2 text-sm text-gray-500">Đang tải loại sách...</p> : null}
                {!loadingCategories && !categories.length ? <p className="px-2.5 py-2 text-sm text-gray-500">Chưa có loại sách.</p> : null}
                {categories.map((category) => {
                    const active = filters.categorySlugs?.includes(category.slug);
                    return <button key={category.bookCategoryId} type="button" onClick={() => onToggleCategory(category.slug)} className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition ${active ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${active ? 'border-blue-800 bg-blue-800 text-white' : 'border-gray-300 bg-white'}`}>{active ? <Check size={12} strokeWidth={3} /> : null}</span><span className="truncate">{category.name}</span></button>;
                })}
            </div>
        </section>

        <section className="pt-4">
            <h3 className="text-sm font-bold text-blue-950">Gợi ý</h3>
            <button type="button" onClick={() => onChange('isFeatured', filters.isFeatured ? '' : true)} className={`mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition ${filters.isFeatured ? 'bg-yellow-50 text-blue-950' : 'text-gray-700 hover:bg-gray-50'}`}><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${filters.isFeatured ? 'border-yellow-500 bg-yellow-500 text-blue-950' : 'border-gray-300 bg-white'}`}>{filters.isFeatured ? <Check size={12} strokeWidth={3} /> : null}</span>Sách nổi bật</button>
        </section>
    </aside>
);

export default BookMarketplaceFilters;
