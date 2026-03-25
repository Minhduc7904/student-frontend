import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentLoading } from '../../../shared/components';
import CompetitionCard from './CompetitionCard';
import {
    fetchMainCompetitions,
    selectMainCompetitions,
    selectMainCompetitionsError,
    selectMainCompetitionsLoading,
    selectMainCompetitionPagination,
} from '../store/competitionSlice';

/**
 * MainCompetitionList
 * Hiển thị danh sách cuộc thi cho content chính.
 */
const MainCompetitionList = () => {
    const dispatch = useDispatch();
    const competitions = useSelector(selectMainCompetitions);
    const loading = useSelector(selectMainCompetitionsLoading);
    const error = useSelector(selectMainCompetitionsError);
    const pagination = useSelector(selectMainCompetitionPagination);
    const [activeTab, setActiveTab] = useState('ONGOING');
    const [page, setPage] = useState(1);

    const tabs = [
        { key: 'ONGOING', label: 'Đang diễn ra' },
        { key: 'UPCOMING', label: 'Sắp bắt đầu' },
    ];

    useEffect(() => {
        dispatch(fetchMainCompetitions({ publicStatus: activeTab, page, limit: 3 }));
    }, [dispatch, activeTab, page]);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const currentPage = pagination?.page ?? page;
    const totalPages = pagination?.totalPages ?? 1;
    const hasPrevious = pagination?.hasPrevious ?? currentPage > 1;
    const hasNext = pagination?.hasNext ?? currentPage < totalPages;
    const visibleCompetitions = competitions.slice(0, 3);

    const handlePrev = () => {
        if (!hasPrevious) return;
        setPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        if (!hasNext) return;
        setPage((prev) => prev + 1);
    };

    const renderTabs = (
        <div className="w-full flex justify-center">
            <div className="inline-flex items-center rounded-3xl bg-[#F1F5F9] p-1">
                {tabs.map((tab) => {
                    const isActive = tab.key === activeTab;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 md:px-5 py-2 rounded-3xl text-text-4 font-semibold transition-colors cursor-pointer ${isActive
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="w-full flex flex-col gap-3">
                {renderTabs}
                <ContentLoading message="Đang tải danh sách cuộc thi..." height="py-20" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex flex-col gap-3">
                {renderTabs}
                <div className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                    Không thể tải danh sách cuộc thi. Vui lòng thử lại sau.
                </div>
            </div>
        );
    }

    if (!competitions?.length) {
        return (
            <div className="w-full flex flex-col gap-3">
                {renderTabs}
                <div className="flex flex-col items-center justify-center py-20 rounded-2xl">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Chưa có cuộc thi nào
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Bạn chưa có cuộc thi nào trong danh mục này.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3">
            {renderTabs}

            <div className="w-full relative flex items-center justify-center">
                <button
                    onClick={handlePrev}
                    disabled={!hasPrevious}
                    className="cursor-pointer absolute -left-4 z-10 p-3 rounded-full bg-white shadow-md hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Trang trước"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    className={`w-full px-4 py-4 sm:py-5 ${visibleCompetitions.length < 3
                            ? 'flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-5'
                            : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
                        }`}
                >
                    {visibleCompetitions.map((item) => {
                        const id = item.competitionId ?? item.id;
                        return (
                            <CompetitionCard
                                key={id ?? item.title ?? item.name}
                                competition={item}
                            />
                        );
                    })}
                </div>

                <button
                    onClick={handleNext}
                    disabled={!hasNext}
                    className="cursor-pointer absolute -right-4 z-10 p-3 rounded-full bg-white shadow-md hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Trang sau"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default memo(MainCompetitionList);
