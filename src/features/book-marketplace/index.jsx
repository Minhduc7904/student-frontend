import { LibraryBig } from 'lucide-react';
import BookMarketplaceControls from './components/BookMarketplaceControls';
import BookMarketplaceFilters from './components/BookMarketplaceFilters';
import BookMarketplaceResults from './components/BookMarketplaceResults';
import { useBookMarketplace } from './hooks/useBookMarketplace';

const BookMarketplacePage = () => {
    const { books, categories, loading, loadingCategories, error, filters, pagination, updateFilter, toggleCategory, changePage, resetFilters } = useBookMarketplace();

    return <main className="w-full text-blue-950"><header className="mt-3 flex items-start gap-3 sm:mt-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-blue-950 shadow-sm"><LibraryBig size={21} /></span><div><h1 className="text-2xl font-bold sm:text-3xl">Mua sách</h1><p className="mt-1 text-sm leading-6 text-gray-600">Khám phá sách tham khảo và kỹ năng học tập dành cho bạn.</p></div></header><div className="mt-7 grid gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:items-start"><BookMarketplaceFilters filters={filters} categories={categories} loadingCategories={loadingCategories} onChange={updateFilter} onToggleCategory={toggleCategory} onReset={resetFilters} /><div className="min-w-0"><BookMarketplaceControls filters={filters} onChange={updateFilter} /><BookMarketplaceResults books={books} loading={loading} error={error} pagination={pagination} onPageChange={changePage} /></div></div></main>;
};

export default BookMarketplacePage;
