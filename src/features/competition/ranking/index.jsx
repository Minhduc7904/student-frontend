import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Crown, Lock, Percent, RefreshCw, Users } from 'lucide-react';
import { Pagination } from '../../../shared/components';
import { DEFAULT_IMAGES } from '../../../shared/constants';
import { selectCompetitionDetail } from '../competitionDetail/store';
import './ranking-loading.css';
import {
    clearCompetitionRankingLeaderboard,
    fetchCompetitionRankingLeaderboard,
    selectCompetitionRankingCurrentUserRank,
    selectCompetitionRankingCurrentUserRanking,
    selectCompetitionRankingLeaderboard,
    selectCompetitionRankingError,
    selectCompetitionRankingLoading,
    selectCompetitionRankingPagination,
} from './store';

const CompetitionRankingPage = ({ competitionId: competitionIdProp, detail: detailProp }) => {
    const dispatch = useDispatch();
    const { competitionId: competitionIdFromParams } = useParams();
    const detailFromStore = useSelector(selectCompetitionDetail);
    const leaderboard = useSelector(selectCompetitionRankingLeaderboard);
    const currentUserRank = useSelector(selectCompetitionRankingCurrentUserRank);
    const currentUserRanking = useSelector(selectCompetitionRankingCurrentUserRanking);
    const loading = useSelector(selectCompetitionRankingLoading);
    const error = useSelector(selectCompetitionRankingError);
    const pagination = useSelector(selectCompetitionRankingPagination);

    const [page, setPage] = useState(1);
    const limit = 20;

    const competitionId = competitionIdProp ?? competitionIdFromParams;
    const detail = detailProp ?? detailFromStore;

    const canShowLeaderboard = Boolean(detail?.allowLeaderboard);
    const competitionTitle = detail?.title ?? detail?.name ?? '';
    const currentPage = pagination?.page ?? page;
    const totalPages = pagination?.totalPages ?? 1;
    const totalParticipants = pagination?.total ?? leaderboard?.pagination?.total ?? 0;
    const hasCurrentUserRanking = Boolean(currentUserRanking || currentUserRank != null);
    const canReload = Boolean(competitionId && canShowLeaderboard);

    useEffect(() => {
        setPage(1);
    }, [competitionId]);

    useEffect(() => {
        if (!competitionId || !canShowLeaderboard) {
            dispatch(clearCompetitionRankingLeaderboard());
            return;
        }

        dispatch(
            fetchCompetitionRankingLeaderboard({
                competitionId,
                query: { page, limit },
            }),
        );
    }, [dispatch, competitionId, canShowLeaderboard, page]);

    const handleReloadLeaderboard = () => {
        if (!canReload) return;

        dispatch(
            fetchCompetitionRankingLeaderboard({
                competitionId,
                query: { page, limit },
            }),
        );
    };

    const rankings = useMemo(() => {
        const raw = leaderboard?.rankings ?? [];
        return [...raw].sort((a, b) => (a?.rank ?? 9999) - (b?.rank ?? 9999));
    }, [leaderboard]);

    const formatTimeSpent = (seconds) => {
        if (seconds == null || Number.isNaN(Number(seconds))) return '--:--';

        const totalSeconds = Math.max(0, Number(seconds));
        const hh = Math.floor(totalSeconds / 3600);
        const mm = Math.floor((totalSeconds % 3600) / 60);
        const ss = totalSeconds % 60;

        if (hh > 0) {
            return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
        }

        return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    };

    const getStudentName = (student) => {
        return student?.fullName || `${student?.lastName ?? ''} ${student?.firstName ?? ''}`.trim() || 'Học sinh';
    };

    const getPercentageLabel = (item) => {
        if (item?.percentageScore != null) {
            return `${Number(item.percentageScore).toFixed(1)}%`;
        }

        return '--';
    };

    const getPointWithMaxLabel = (item) => {
        const totalPoints = item?.totalPoints;
        const maxPoints = item?.maxPoints;

        if (totalPoints == null || maxPoints == null) return '--';
        return `${totalPoints}/${maxPoints}`;
    };

    const RANK_CROWN_STYLE = {
        1: { ring: '#E0B84F', bg: '#F6D77A' },
        2: { ring: '#9EA4AA', bg: '#D6D9DD' },
        3: { ring: '#B8836A', bg: '#E0B199' },
    };

    const renderRankCell = (rankValue) => {
        const numericRank = Number(rankValue);
        const crownStyle = RANK_CROWN_STYLE[numericRank];

        if (!crownStyle) {
            return <span>{rankValue ?? '--'}</span>;
        }

        return (
            <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                style={{
                    backgroundColor: crownStyle.bg,
                    border: `1px solid ${crownStyle.ring}`,
                }}
                aria-label={`Hạng ${numericRank}`}
                title={`Hạng ${numericRank}`}
            >
                <Crown size={13} className="text-white" />
            </span>
        );
    };

    const getRowHighlightClass = (rankValue, index) => {
        const numericRank = Number(rankValue);

        if (numericRank === 1) {
            return 'border-amber-200 bg-amber-50/85';
        }

        if (numericRank === 2) {
            return 'border-slate-300 bg-slate-100/90';
        }

        if (numericRank === 3) {
            return 'border-orange-200 bg-orange-50/85';
        }

        return index % 2 === 0 ? 'border-transparent bg-[#f8fafc]' : 'border-transparent bg-[#f1f5f9]';
    };

    const skeletonRows = Array.from({ length: 20 }, (_, index) => index);

    return (
        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-h4 text-gray-900">Bảng xếp hạng</h2>
                    {competitionTitle && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-text-5 font-semibold text-blue-800">
                            {competitionTitle}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-text-5 font-semibold text-emerald-700">
                        <Users size={14} />
                        {totalParticipants} người tham gia
                    </span>
                    <button
                        type="button"
                        onClick={handleReloadLeaderboard}
                        disabled={loading || !canReload}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-text-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                </div>
                <p className="mt-1 text-text-5 text-gray-600">Danh sách xếp hạng chi tiết theo cuộc thi.</p>
            </div>

            {!competitionId ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Thiếu mã cuộc thi.
                </div>
            ) : !canShowLeaderboard ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-500">
                    <Lock size={28} className="text-gray-400" />
                    <p className="text-text-4">Cuộc thi này không cho phép xem bảng xếp hạng.</p>
                </div>
            ) : loading ? (
                <div className="w-full overflow-hidden">
                    <div className="hidden md:block w-full">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                            <div className="w-12 md:w-20">#</div>
                            <div className="flex-1 md:w-[40%]">Học sinh</div>
                            <div className="w-20 md:w-[14%] text-start">Điểm</div>
                            <div className="w-14 md:w-[12%] text-start">%</div>
                            <div className="hidden md:block md:w-[14%] text-start">Lần thi</div>
                            <div className="hidden sm:block sm:w-20 md:flex-1 text-start">Thời gian</div>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {skeletonRows.map((rowIndex) => (
                                <div
                                    key={`ranking-skeleton-${rowIndex}`}
                                    className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                                    style={{ animationDelay: `${rowIndex * 35}ms` }}
                                >
                                    <div className="w-20">
                                        <div className="ranking-skeleton-block h-5 w-8 rounded-md" />
                                    </div>

                                    <div className="w-[40%]">
                                        <div className="flex items-center gap-2">
                                            <div className="ranking-skeleton-block h-8 w-8 rounded-full" />
                                            <div className="ranking-skeleton-block h-4 w-44 max-w-[90%] rounded-md" />
                                        </div>
                                    </div>

                                    <div className="w-[14%]">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                    <div className="w-[12%]">
                                        <div className="ranking-skeleton-block h-4 w-14 rounded-md" />
                                    </div>
                                    <div className="w-[14%]">
                                        <div className="ranking-skeleton-block h-4 w-12 rounded-md" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2 space-y-2 md:hidden">
                        {skeletonRows.slice(0, 8).map((rowIndex) => (
                            <div
                                key={`ranking-mobile-skeleton-${rowIndex}`}
                                className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="ranking-skeleton-block h-8 w-8 rounded-full" />
                                    <div className="ranking-skeleton-block h-4 w-32 rounded-md" />
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                    Không thể tải bảng xếp hạng.
                </div>
            ) : rankings.length === 0 && !hasCurrentUserRanking ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Chưa có dữ liệu xếp hạng.
                </div>
            ) : (
                <div className="w-full overflow-hidden">
                    {hasCurrentUserRanking && (
                        <div className="mb-4 rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-sky-50 px-4 py-3">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                                    Xếp hạng của bạn: {currentUserRanking?.rank ?? currentUserRank ?? '--'}
                                </span>
                                <span className="font-semibold text-blue-900">
                                    {getStudentName(currentUserRanking?.student ?? {})}
                                </span>
                                <span className="text-slate-600">
                                    Điểm: <span className="font-semibold text-slate-900">{getPointWithMaxLabel(currentUserRanking ?? {})}</span>
                                </span>
                                <span className="text-slate-600">
                                    %: <span className="font-semibold text-slate-900">{getPercentageLabel(currentUserRanking ?? {})}</span>
                                </span>
                                <span className="text-slate-600">
                                    Lần thi: <span className="font-semibold text-slate-900">{currentUserRanking?.attemptNumber ?? '-'}</span>
                                </span>
                                <span className="text-slate-600">
                                    Thời gian: <span className="font-semibold text-slate-900">{formatTimeSpent(currentUserRanking?.timeSpentSeconds)}</span>
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="hidden md:block w-full">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                            <div className="w-20">#</div>
                            <div className="w-[40%]">Học sinh</div>
                            <div className="w-[14%] text-start">Điểm</div>
                            <div className="w-[12%] inline-flex items-center justify-start gap-1">
                                <Percent size={14} />
                            </div>
                            <div className="w-[14%] text-start">Lần thi</div>
                            <div className="flex-1 text-start">Thời gian</div>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {rankings.map((item, index) => {
                                const student = item?.student ?? {};
                                const rankValue = item?.rank ?? index + 1;
                                return (
                                    <div
                                        key={item?.competitionSubmitId ?? `${item?.rank ?? index}-${index}`}
                                        className={`ranking-wave-row flex items-center rounded-xl border px-4 py-2 transition-colors duration-200 ${getRowHighlightClass(rankValue, index)}`}
                                        style={{ animationDelay: `${Math.min(index, 19) * 55}ms` }}
                                    >
                                        <div className="w-20 text-sm font-medium text-gray-600">{renderRankCell(rankValue)}</div>
                                        <div className="w-[40%]">
                                            <div className="flex items-center gap-2">
                                                <div className="shrink-0 rounded-full bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 p-px">
                                                    <div className="rounded-full bg-white p-px">
                                                        <img
                                                            src={student?.avatarUrl || DEFAULT_IMAGES.USER_AVATAR}
                                                            alt={getStudentName(student)}
                                                            loading="lazy"
                                                            className="h-8 w-8 min-h-8 min-w-8 rounded-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <span className="whitespace-normal wrap-break-word text-sm text-gray-700">{getStudentName(student)}</span>
                                            </div>
                                        </div>
                                        <div className="w-[14%] text-start text-sm font-semibold text-gray-900">{getPointWithMaxLabel(item)}</div>
                                        <div className="w-[12%] text-start text-sm font-semibold text-gray-900">{getPercentageLabel(item)}</div>
                                        <div className="w-[14%] text-start text-sm text-gray-700">{item?.attemptNumber ?? '-'}</div>
                                        <div className="flex-1 text-start text-sm text-gray-700">
                                            {formatTimeSpent(item?.timeSpentSeconds)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2 md:hidden">
                        {rankings.map((item, index) => {
                            const student = item?.student ?? {};
                            const rankValue = item?.rank ?? index + 1;

                            return (
                                <article
                                    key={`mobile-${item?.competitionSubmitId ?? `${item?.rank ?? index}-${index}`}`}
                                    className={`rounded-xl border px-3 py-3 ${getRowHighlightClass(rankValue, index)}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-semibold text-gray-700">{renderRankCell(rankValue)}</div>
                                        <img
                                            src={student?.avatarUrl || DEFAULT_IMAGES.USER_AVATAR}
                                            alt={getStudentName(student)}
                                            loading="lazy"
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                        <p className="min-w-0 flex-1 text-sm font-medium text-gray-800 break-all">{getStudentName(student)}</p>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                            Điểm: <span className="font-semibold text-slate-900">{getPointWithMaxLabel(item)}</span>
                                        </div>
                                        <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                            %: <span className="font-semibold text-slate-900">{getPercentageLabel(item)}</span>
                                        </div>
                                        <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                            Lần thi: <span className="font-semibold text-slate-900">{item?.attemptNumber ?? '-'}</span>
                                        </div>
                                        <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                            TG: <span className="font-semibold text-slate-900">{formatTimeSpent(item?.timeSpentSeconds)}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
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

export default CompetitionRankingPage;
