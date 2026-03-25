import { memo, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Infinity as InfinityIcon, PlayCircle } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useNavigate } from 'react-router-dom';
import Competition10Image from '../../../assets/images/Competition10.png';
import Competition11Image from '../../../assets/images/Competition11.png';
import Competition12Image from '../../../assets/images/Competition12.png';
import CompetitionDefaultImage from '../../../assets/images/CompetitionDefault.png';
import { ROUTES } from '../../../core/constants';
import { formatDateTime } from '../../../shared/utils/dateUtils';

const getCardBackgroundImage = (competition) => {
    const grade =
        competition?.exam?.grade ??
        competition?.competition?.exam?.grade ??
        competition?.grade;

    const normalizedGrade = Number(grade);

    if (normalizedGrade === 10) return Competition10Image;
    if (normalizedGrade === 11) return Competition11Image;
    if (normalizedGrade === 12) return Competition12Image;

    return CompetitionDefaultImage;
};

const CompetitionCard = ({ competition }) => {
    const navigate = useNavigate();
    const [nowTs, setNowTs] = useState(Date.now());

    const id =
        competition?.competitionId ??
        competition?.id ??
        competition?.competition?.competitionId ??
        competition?.competition?.id;
    const title = competition?.title ?? competition?.name ?? `Cuộc thi #${id ?? ''}`;
    const grade =
        competition?.exam?.grade ??
        competition?.competition?.exam?.grade ??
        competition?.grade;
    const timelineStatus = competition?.timelineStatus;
    const attemptStatus = competition?.attemptStatus;
    const durationMinutes = competition?.durationMinutes;
    const startDate = competition?.startDate;
    const endDate = competition?.endDate;

    const isOngoing = timelineStatus === 'ONGOING';
    const isUpcoming = timelineStatus === 'UPCOMING';
    const isAttempted = attemptStatus === 'ATTEMPTED';
    const isInProgress = attemptStatus === 'IN_PROGRESS';
    const bg = getCardBackgroundImage(competition);

    useEffect(() => {
        if (!isOngoing || !endDate) return undefined;

        const timer = setInterval(() => {
            setNowTs(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [isOngoing, endDate]);

    const ongoingCountdownLabel = useMemo(() => {
        if (!isOngoing || !endDate) return '';

        const endMs = new Date(endDate).getTime();
        if (Number.isNaN(endMs)) return '';

        const diffMs = Math.max(0, endMs - nowTs);
        const totalSeconds = Math.floor(diffMs / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');

        if (totalSeconds === 0) return 'Đã kết thúc';
        if (days > 0) return `Còn ${days} ngày ${hh}:${mm}:${ss}`;
        return `Còn ${hh}:${mm}:${ss}`;
    }, [isOngoing, endDate, nowTs]);

    const upcomingRange = useMemo(() => {
        if (!isUpcoming || !startDate) return null;

        const formattedStart = formatDateTime(startDate);
        const formattedEnd = endDate ? formatDateTime(endDate) : null;

        return {
            formattedStart,
            formattedEnd,
        };
    }, [isUpcoming, startDate, endDate]);

    const handleGoDetail = () => {
        if (!id) return;
        navigate(ROUTES.COMPETITION_DETAIL(id));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleGoDetail();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleGoDetail}
            onKeyDown={handleKeyDown}
            className="w-full lg:w-87.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-3xl"
            aria-label={`Xem chi tiết cuộc thi ${title}`}
        >
            <Tilt
                className="w-full h-57.5 relative rounded-3xl shadow-lg overflow-hidden hover:cursor-pointer"
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                perspective={1000}
                transitionSpeed={700}
                scale={1.04}
                glareEnable={true}
                glareMaxOpacity={0.45}
                glareColor="#ffffff"
                glarePosition="all"
                glareBorderRadius="1.5rem"
                glareReverse={true}
            >
                <img
                    src={bg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/10" />

                <div className="absolute top-3 left-3 z-10">
                    <div className="rounded-full bg-white/90 backdrop-blur px-3 py-1 border border-white/70 shadow-sm">
                        <span className="text-text-5 font-semibold text-gray-800">
                            Khối {grade ?? '--'}
                        </span>
                    </div>
                </div>

                {isOngoing && (
                    <div className="absolute top-3 right-3 z-10">
                        <div className="rounded-xl bg-white/90 backdrop-blur px-3 py-1.5 border border-white/70 shadow-sm">
                            {endDate ? (
                                <p className="text-text-5 font-semibold text-orange-700">
                                    {ongoingCountdownLabel}
                                </p>
                            ) : (
                                <div className="flex items-center gap-1 text-orange-700">
                                    <InfinityIcon size={16} />
                                    <span className="text-text-5 font-semibold">Không giới hạn</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="bg-white/80 backdrop-blur p-4 rounded-b-3xl flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-h5 text-gray-900 truncate">{title}</h3>

                            {isUpcoming && upcomingRange && (
                                <div className="mt-1 text-text-5 text-blue-800 font-medium flex items-center gap-1.5">
                                    <span>{upcomingRange.formattedStart}</span>
                                    <span>-</span>
                                    {upcomingRange.formattedEnd ? (
                                        <span>{upcomingRange.formattedEnd}</span>
                                    ) : (
                                        <InfinityIcon size={14} className="text-blue-800" />
                                    )}
                                </div>
                            )}

                            {isOngoing && (
                                <p className="mt-1 text-text-5 text-blue-800 font-medium">
                                    {isInProgress ? 'Đang làm bài' : `${durationMinutes ?? '--'} phút`}
                                </p>
                            )}

                            {isInProgress && !isOngoing && (
                                <p className="mt-1 text-text-5 text-blue-800 font-medium">
                                    Đang làm bài
                                </p>
                            )}
                        </div>

                        <div className="shrink-0 pt-1">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                                {isUpcoming ? (
                                    <Clock3 size={20} className="text-orange-600" />
                                ) : isInProgress ? (
                                    <PlayCircle size={20} className="text-emerald-600" />
                                ) : isAttempted ? (
                                    <CheckCircle2 size={20} className="text-emerald-600" />
                                ) : (
                                    <ArrowRight size={20} className="text-gray-500" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Tilt>
        </div>
    );
};

export default memo(CompetitionCard);