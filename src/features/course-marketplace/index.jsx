import { ShoppingCart } from "lucide-react";
import { CourseModeTabs } from "../home/courses/components";
import MarketplaceCourseResults from "./components/MarketplaceCourseResults";
import MarketplaceFilters from "./components/MarketplaceFilters";
import MarketplaceSortControls from "./components/MarketplaceSortControls";
import { useMarketplaceCourses } from "./hooks/useMarketplaceCourses";

export const CourseMarketplacePage = () => {
    const {
        courses,
        subjects,
        loading,
        loadingSubjects,
        error,
        filters,
        pagination,
        updateFilter,
        changePage,
        resetFilters,
    } = useMarketplaceCourses();

    return (
        <main className="w-full text-blue-950">
            <CourseModeTabs />
            <header className="mt-7 flex items-start gap-3 sm:mt-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-blue-950 shadow-sm"><ShoppingCart size={21} /></span>
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Mua khóa học</h1>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Khám phá các khóa học online phù hợp với lộ trình của bạn.</p>
                </div>
            </header>
            <div className="mt-7 grid gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:items-start">
                <MarketplaceFilters filters={filters} subjects={subjects} loadingSubjects={loadingSubjects} onChange={updateFilter} onReset={resetFilters} />
                <div className="min-w-0">
                    <MarketplaceSortControls filters={filters} onChange={updateFilter} />
                    <MarketplaceCourseResults courses={courses} loading={loading} error={error} pagination={pagination} onPageChange={changePage} />
                </div>
            </div>
        </main>
    );
};

export default CourseMarketplacePage;
