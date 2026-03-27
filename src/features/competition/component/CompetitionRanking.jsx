import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { ContentLoading } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import {
    clearCompetitionLeaderboard,
    selectCompetitionCurrentUserRank,
    selectCompetitionCurrentUserRanking,
    fetchCompetitionLeaderboard,
    finishSelectingCompetition,
    selectCompetitionLeaderboard,
    selectCompetitionLeaderboardError,
    selectCompetitionLeaderboardLoading,
    selectSelectedCompetition,
    selectSelectedCompetitionId,
} from '../store/competitionSlice';
import { Podium } from '../../../shared/components';
import RankingCardItem from './RankingCardItem';
/**
 * CompetitionRanking
 * Cột trái: hiển thị leaderboard của cuộc thi đang chọn (mặc định lấy cuộc thi đầu tiên ở main list).
 */
const CompetitionRanking = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedCompetition = useSelector(selectSelectedCompetition);
    const activeCompetitionId = useSelector(selectSelectedCompetitionId);
    const leaderboard = useSelector(selectCompetitionLeaderboard);
    const currentUserRank = useSelector(selectCompetitionCurrentUserRank);
    const currentUserRanking = useSelector(selectCompetitionCurrentUserRanking);
    const loading = useSelector(selectCompetitionLeaderboardLoading);
    const error = useSelector(selectCompetitionLeaderboardError);
    const canShowLeaderboard = Boolean(selectedCompetition?.allowLeaderboard);
    const competitionTitle = selectedCompetition?.title ?? selectedCompetition?.name ?? '';

    useEffect(() => {
        if (!activeCompetitionId || !canShowLeaderboard) {
            dispatch(clearCompetitionLeaderboard());
            dispatch(finishSelectingCompetition());
            return;
        }

        dispatch(
            fetchCompetitionLeaderboard({
                competitionId: activeCompetitionId,
                query: { page: 1, limit: 10 },
            })
        );
    }, [dispatch, activeCompetitionId, canShowLeaderboard]);

    const rankings = leaderboard?.rankings ?? [];
    const sortedRankings = [...rankings].sort((a, b) => (a?.rank ?? 9999) - (b?.rank ?? 9999));
    const hasCurrentUserRanking = Boolean(currentUserRanking || currentUserRank != null);

    const topRankMap = {
        1: sortedRankings.find((item) => item?.rank === 1) ?? null,
        2: sortedRankings.find((item) => item?.rank === 2) ?? null,
        3: sortedRankings.find((item) => item?.rank === 3) ?? null,
    };

    const topLayout = [2, 1, 3];
    const topPodiumRanks = topLayout.filter((rank) => Boolean(topRankMap[rank]));
    const podiumHeightByRank = {
        1: 122,
        2: 102,
        3: 90,
    };

    const remainingRankings = sortedRankings.filter((item) => (item?.rank ?? 0) >= 4);

    const getScoreLabel = (item) => {
        if (item?.percentageScore != null) {
            return `${Number(item.percentageScore).toFixed(1)}%`;
        }

        return `${item?.totalPoints ?? 0} điểm`;
    };

    const getStudentName = (student) => {
        return student?.fullName || `${student?.lastName ?? ''} ${student?.firstName ?? ''}`.trim() || 'Học sinh';
    };

    const getStudentId = (student) => {
        return student?.studentId ?? student?.id ?? student?.userId ?? null;
    };

    const handleOpenStudentProfile = (student) => {
        const studentId = getStudentId(student);
        if (!studentId) return;
        navigate(ROUTES.STUDENT_PROFILE_DETAIL(studentId));
    };

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

    const handleViewAll = () => {
        if (!activeCompetitionId) return;
        navigate(`${ROUTES.COMPETITION_DETAIL(activeCompetitionId)}/ranking`);
    };

    return (
        <section className="rounded-2xl p-4 md:p-5">
            <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-h4 text-gray-900">Bảng xếp hạng</h3>
                    {competitionTitle && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-text-5 font-semibold text-blue-800">
                            {competitionTitle}
                        </span>
                    )}
                </div>
                <p className="text-text-5 text-gray-600 mt-1">Top học sinh có thành tích tốt nhất.</p>
            </div>

            {!activeCompetitionId ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Chưa có cuộc thi để hiển thị bảng xếp hạng.
                </div>
            ) : !canShowLeaderboard ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-500">
                    <Lock size={28} className="text-gray-400" />
                    <p className="text-text-4">Cuộc thi này không cho phép xem bảng xếp hạng.</p>
                </div>
            ) : loading ? (
                <ContentLoading message="Đang tải bảng xếp hạng..." height="py-12" />
            ) : error ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                    Không thể tải bảng xếp hạng.
                </div>
            ) : rankings.length === 0 && !hasCurrentUserRanking ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Chưa có dữ liệu xếp hạng.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {hasCurrentUserRanking && (
                        <div className="flex flex-col gap-1">
                            <p className="text-text-5 font-semibold text-blue-800">Xếp hạng của bạn</p>
                            <RankingCardItem
                                rank={currentUserRanking?.rank ?? currentUserRank ?? '--'}
                                fullName={getStudentName(currentUserRanking?.student ?? {})}
                                avatarUrl={currentUserRanking?.student?.avatarUrl}
                                scoreLabel={getScoreLabel(currentUserRanking ?? {})}
                                attemptLabel={currentUserRanking?.attemptNumber ?? '-'}
                                timeLabel={formatTimeSpent(currentUserRanking?.timeSpentSeconds)}
                                className="border-blue-200 bg-blue-50/70"
                                entryDelay={80}
                                onClick={() => handleOpenStudentProfile(currentUserRanking?.student)}
                            />
                        </div>
                    )}

                    {topPodiumRanks.length > 0 && (
                        <div className="rounded-2xl px-3 pt-4 pb-3">
                            <div className="flex items-end justify-center gap-2 md:gap-4">
                                {topPodiumRanks.map((rank, rankIndex) => {
                                    const rankingItem = topRankMap[rank];
                                    const student = rankingItem?.student ?? {};
                                    const fullName = getStudentName(student);

                                    return (
                                        <button
                                            key={`podium-rank-${rank}`}
                                            type="button"
                                            onClick={() => handleOpenStudentProfile(student)}
                                            className="group flex w-24 cursor-pointer flex-col items-center text-center"
                                        >
                                            <Podium
                                                className="mx-auto"
                                                rank={rank}
                                                width={80}
                                                height={podiumHeightByRank[rank]}
                                                avatarUrl={student?.avatarUrl}
                                                avatarAlt={fullName}
                                                hoverGrow
                                                sprout
                                                sproutDelay={rankIndex * 140}
                                                studentName={fullName}
                                                totalPoints={rankingItem?.totalPoints}
                                                maxPoints={rankingItem?.maxPoints}
                                                timeSpentSeconds={rankingItem?.timeSpentSeconds}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {remainingRankings.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {remainingRankings.slice(0, 8).map((item, index) => {
                                const student = item?.student ?? {};
                                const fullName = getStudentName(student);
                                const scoreLabel = getScoreLabel(item);
                                const timeLabel = formatTimeSpent(item?.timeSpentSeconds);

                                return (
                                    <RankingCardItem
                                        key={item?.competitionSubmitId ?? `${fullName}-${index}`}
                                        rank={item?.rank ?? index + 4}
                                        fullName={fullName}
                                        avatarUrl={student?.avatarUrl}
                                        scoreLabel={scoreLabel}
                                        attemptLabel={item?.attemptNumber ?? '-'}
                                        timeLabel={timeLabel}
                                        entryDelay={index * 70 + 120}
                                        onClick={() => handleOpenStudentProfile(student)}
                                    />
                                );
                            })}

                            <div className="pt-1 text-center">
                                <button
                                    type="button"
                                    onClick={handleViewAll}
                                    disabled={!activeCompetitionId}
                                    className="cursor-pointer text-text-4 font-semibold text-blue-700 transition-colors duration-200 hover:text-blue-800 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                                >
                                    Xem tất cả
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default memo(CompetitionRanking);
