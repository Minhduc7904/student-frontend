import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpDown, Eye, Lock, RefreshCw, Users } from 'lucide-react';
import { Pagination } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import '../ranking/ranking-loading.css';
import {
    clearCompetitionStudentHistory,
    fetchCompetitionStudentHistory,
    selectCompetitionStudentHistory,
    selectCompetitionStudentHistoryError,
    selectCompetitionStudentHistoryLoading,
    selectCompetitionStudentHistoryPagination,
} from './store';

const CompetitionHistoryPage = ({ competitionId: competitionIdProp, onViewResult }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { competitionId: competitionIdFromParams } = useParams();
    const competitionId = competitionIdProp ?? competitionIdFromParams;
    const history = useSelector(selectCompetitionStudentHistory);
    const loading = useSelector(selectCompetitionStudentHistoryLoading);
    const error = useSelector(selectCompetitionStudentHistoryError);
    const pagination = useSelector(selectCompetitionStudentHistoryPagination);
    const [page, setPage] = useState(1);
    const limit = 20;
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        setPage(1);
    }, [competitionId]);

    useEffect(() => {
        if (!competitionId) {
            dispatch(clearCompetitionStudentHistory());
            return;
        }

        dispatch(
            fetchCompetitionStudentHistory({
                competitionId,
                query: {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                },
            })
        );

        return () => {
            dispatch(clearCompetitionStudentHistory());
        };
    }, [dispatch, competitionId, page, sortBy, sortOrder]);

    const total = pagination?.total ?? history.length;
    const currentPage = pagination?.page ?? page;
    const totalPages = pagination?.totalPages ?? 1;
    const canReload = Boolean(competitionId);

    const normalizedError = useMemo(() => {
        if (!error) return '';
        return typeof error === 'string' ? error : error?.message || 'Không thể tải lịch sử làm bài.';
    }, [error]);

    const formatTimeSpent = (item) => {
        if (item?.timeSpentDisplay) return item.timeSpentDisplay;

        const seconds = item?.timeSpentSeconds;
        if (seconds == null || Number.isNaN(Number(seconds))) return '--';

        const totalSeconds = Math.max(0, Number(seconds));
        const hh = Math.floor(totalSeconds / 3600);
        const mm = Math.floor((totalSeconds % 3600) / 60);
        const ss = totalSeconds % 60;

        if (hh > 0) {
            return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
        }

        return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    };

    const formatPointLabel = (item) => {
        if (!item?.hasScore || item?.totalPoints == null || item?.maxPoints == null) return '--';
        return `${item.totalPoints}/${item.maxPoints}`;
    };

    const formatPercentLabel = (item) => {
        if (!item?.hasScore || item?.scorePercentage == null) return '--';
        return `${Number(item.scorePercentage).toFixed(1)}%`;
    };

    const getRowHighlightClass = (index) => {
        return index % 2 === 0 ? 'border-transparent bg-[#f8fafc]' : 'border-transparent bg-[#f1f5f9]';
    };

    const handleReload = () => {
        if (!canReload) return;

        dispatch(
            fetchCompetitionStudentHistory({
                competitionId,
                query: {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                },
            })
        );
    };

    const toggleSort = (field) => {
        setPage(1);
        if (sortBy === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }

        setSortBy(field);
        setSortOrder('desc');
    };

    const getSortLabel = (field) => {
        if (sortBy !== field) return 'Chưa sắp xếp';
        return sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần';
    };

    const handleViewResult = (submitId) => {
        if (!submitId || !competitionId) return;

        if (typeof onViewResult === 'function') {
            onViewResult({ submitId, competitionId });
            return;
        }

        navigate(ROUTES.COMPETITION_RESULT(competitionId, submitId));
    };

    const skeletonRows = Array.from({ length: 10 }, (_, index) => index);

    return (
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-h4 text-gray-900">Lịch sử làm bài</h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-text-5 font-semibold text-emerald-700">
                        <Users size={14} />
                        {total} lượt làm bài
                    </span>
                    <button
                        type="button"
                        onClick={handleReload}
                        disabled={loading || !canReload}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-text-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                </div>
                <p className="mt-1 text-text-5 text-gray-600">Danh sách chi tiết các lần làm bài của bạn.</p>
            </div>

            {!competitionId ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Thiếu mã cuộc thi.
                </div>
            ) : loading ? (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                            <button
                                type="button"
                                onClick={() => toggleSort('attemptNumber')}
                                className="cursor-pointer flex w-20 items-center gap-1 text-left"
                                title={`Sắp xếp lần thi: ${getSortLabel('attemptNumber')}`}
                            >
                                Lần thi
                                <ArrowUpDown size={12} className={sortBy === 'attemptNumber' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <div className="w-[16%] text-start">Trạng thái</div>
                            <button
                                type="button"
                                onClick={() => toggleSort('totalPoints')}
                                className="cursor-pointer flex w-[14%] items-center gap-1 text-left"
                                title={`Sắp xếp điểm: ${getSortLabel('totalPoints')}`}
                            >
                                Điểm
                                <ArrowUpDown size={12} className={sortBy === 'totalPoints' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <div className="w-[12%] text-start">%</div>
                            <div className="w-[18%] text-start">Bắt đầu</div>
                            <button
                                type="button"
                                onClick={() => toggleSort('submittedAt')}
                                className="cursor-pointer flex w-[18%] items-center gap-1 text-left"
                                title={`Sắp xếp nộp bài: ${getSortLabel('submittedAt')}`}
                            >
                                Nộp bài
                                <ArrowUpDown size={12} className={sortBy === 'submittedAt' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleSort('timeSpentSeconds')}
                                className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                                title={`Sắp xếp thời gian: ${getSortLabel('timeSpentSeconds')}`}
                            >
                                Thời gian
                                <ArrowUpDown size={12} className={sortBy === 'timeSpentSeconds' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {skeletonRows.map((rowIndex) => (
                                <div
                                    key={`history-skeleton-${rowIndex}`}
                                    className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                                    style={{ animationDelay: `${rowIndex * 35}ms` }}
                                >
                                    <div className="w-20">
                                        <div className="ranking-skeleton-block h-4 w-10 rounded-md" />
                                    </div>
                                    <div className="w-[16%]">
                                        <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                    </div>
                                    <div className="w-[14%]">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                    <div className="w-[12%]">
                                        <div className="ranking-skeleton-block h-4 w-14 rounded-md" />
                                    </div>
                                    <div className="w-[18%]">
                                        <div className="ranking-skeleton-block h-4 w-28 rounded-md" />
                                    </div>
                                    <div className="w-[18%]">
                                        <div className="ranking-skeleton-block h-4 w-28 rounded-md" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2 space-y-2 md:hidden">
                        {skeletonRows.slice(0, 6).map((rowIndex) => (
                            <div
                                key={`history-mobile-skeleton-${rowIndex}`}
                                className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                            >
                                <div className="ranking-skeleton-block h-4 w-24 rounded-md" />
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                </div>
                                <div className="mt-3 ranking-skeleton-block h-8 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : normalizedError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                    {normalizedError}
                </div>
            ) : history.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Chưa có dữ liệu lịch sử làm bài.
                </div>
            ) : (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                            <button
                                type="button"
                                onClick={() => toggleSort('attemptNumber')}
                                className="cursor-pointer flex w-20 items-center gap-1 text-left"
                                title={`Sắp xếp lần thi: ${getSortLabel('attemptNumber')}`}
                            >
                                Lần thi
                                <ArrowUpDown size={12} className={sortBy === 'attemptNumber' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <div className="w-[16%] text-start">Trạng thái</div>
                            <button
                                type="button"
                                onClick={() => toggleSort('totalPoints')}
                                className="cursor-pointer flex w-[14%] items-center gap-1 text-left"
                                title={`Sắp xếp điểm: ${getSortLabel('totalPoints')}`}
                            >
                                Điểm
                                <ArrowUpDown size={12} className={sortBy === 'totalPoints' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <div className="w-[12%] text-start">%</div>
                            <div className="w-[18%] text-start">Bắt đầu</div>
                            <button
                                type="button"
                                onClick={() => toggleSort('submittedAt')}
                                className="cursor-pointer flex w-[18%] items-center gap-1 text-left"
                                title={`Sắp xếp nộp bài: ${getSortLabel('submittedAt')}`}
                            >
                                Nộp bài
                                <ArrowUpDown size={12} className={sortBy === 'submittedAt' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleSort('timeSpentSeconds')}
                                className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                                title={`Sắp xếp thời gian: ${getSortLabel('timeSpentSeconds')}`}
                            >
                                Thời gian
                                <ArrowUpDown size={12} className={sortBy === 'timeSpentSeconds' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {history.map((item, index) => (
                                <div
                                    key={item?.competitionSubmitId ?? `${item?.attemptNumber ?? 'attempt'}-${index}`}
                                    className="cursor-pointer group relative overflow-hidden rounded-xl"
                                    onClick={() => item?.canViewDetail && handleViewResult(item?.competitionSubmitId)}
                                >
                                    <div
                                        className={`ranking-wave-row flex items-center border px-4 py-2 transition-all duration-300 md:group-hover:-translate-x-14 md:group-hover:mr-1 ${getRowHighlightClass(index)}`}
                                        style={{ animationDelay: `${Math.min(index, 19) * 55}ms` }}
                                    >
                                        <div className="w-20 text-sm font-semibold text-gray-700">#{item?.attemptNumber ?? '--'}</div>
                                        <div className="w-[16%] text-start text-sm text-gray-700">{item?.status ?? '--'}</div>
                                        <div className="w-[14%] text-start text-sm font-semibold text-gray-900">{formatPointLabel(item)}</div>
                                        <div className="w-[12%] text-start text-sm font-semibold text-gray-900">{formatPercentLabel(item)}</div>
                                        <div className="w-[18%] text-start text-sm text-gray-700">{item?.startedAt ? new Date(item.startedAt).toLocaleString('vi-VN') : '--'}</div>
                                        <div className="w-[18%] text-start text-sm text-gray-700">{item?.submittedAt ? new Date(item.submittedAt).toLocaleString('vi-VN') : '--'}</div>
                                        <div className="flex-1 text-start text-sm text-gray-700">{formatTimeSpent(item)}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => item?.canViewDetail && handleViewResult(item?.competitionSubmitId)}
                                        disabled={!item?.canViewDetail}
                                        className={`cursor-pointer absolute right-0 top-0 hidden h-full w-14 translate-x-full items-center justify-center text-white opacity-0 scale-95 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-hover:scale-100 ${item?.canViewDetail
                                                ? 'cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-95'
                                                : 'cursor-not-allowed bg-gray-400'
                                            }`}
                                        aria-label={item?.canViewDetail ? 'Xem kết quả' : 'Không thể xem kết quả'}
                                    >
                                        {item?.canViewDetail ? <ArrowRight size={20} /> : <Lock size={18} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 md:hidden">
                        {history.map((item, index) => (
                            <article
                                key={`mobile-${item?.competitionSubmitId ?? `${item?.attemptNumber ?? 'attempt'}-${index}`}`}
                                className={`rounded-xl border px-3 py-3 ${getRowHighlightClass(index)}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold text-gray-800">Lần #{item?.attemptNumber ?? '--'}</p>
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                        {item?.status ?? '--'}
                                    </span>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Điểm: <span className="font-semibold text-slate-900">{formatPointLabel(item)}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        %: <span className="font-semibold text-slate-900">{formatPercentLabel(item)}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Bắt đầu: <span className="font-semibold text-slate-900">{item?.startedAt ? new Date(item.startedAt).toLocaleString('vi-VN') : '--'}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Nộp bài: <span className="font-semibold text-slate-900">{item?.submittedAt ? new Date(item.submittedAt).toLocaleString('vi-VN') : '--'}</span>
                                    </div>
                                    <div className="col-span-2 rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Thời gian: <span className="font-semibold text-slate-900">{formatTimeSpent(item)}</span>
                                    </div>
                                </div>

                                {item?.canViewDetail ? (
                                    <button
                                        type="button"
                                        onClick={() => handleViewResult(item?.competitionSubmitId)}
                                        className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                                    >
                                        <Eye size={15} />
                                        Xem kết quả
                                    </button>
                                ) : null}
                            </article>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default CompetitionHistoryPage;
