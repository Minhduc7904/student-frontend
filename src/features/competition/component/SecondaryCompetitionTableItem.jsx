import { memo } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
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

const SecondaryCompetitionTableItem = ({
    competition,
    activeStatus,
    index = 0,
    isSelected = false,
    onSelect,
}) => {
    const navigate = useNavigate();
    const id = competition?.competitionId ?? competition?.id;
    const title = competition?.title ?? competition?.name ?? `Cuộc thi #${id ?? index + 1}`;
    const grade =
        competition?.exam?.grade ??
        competition?.competition?.exam?.grade ??
        competition?.grade;
    const endDate = competition?.endDate;
    const attemptStatus = competition?.attemptStatus;
    const canShowLeaderboard = Boolean(competition?.allowLeaderboard);

    const isAttempted = attemptStatus === 'ATTEMPTED' || activeStatus === 'ATTEMPTED';
    const statusLabel = isAttempted ? 'Đã làm bài' : 'Chưa làm bài';
    const endTimeLabel = endDate ? formatDateTime(endDate) : 'Không giới hạn';
    const image = getCardBackgroundImage(competition);

    const handleSelectCompetition = () => {
        if (typeof onSelect === 'function') {
            onSelect(competition);
        }
    };

    const handleNavigateDetail = (event) => {
        event?.stopPropagation();
        if (!id) return;
        navigate(ROUTES.COMPETITION_DETAIL(id));
    };

    return (
        <article
            className="
        group cursor-pointer transition-transform duration-200 ease-out
        hover:scale-[1.02]
    "
        >
            <div
                className={`relative overflow-hidden rounded-xl`}
            >
                <div
                    onClick={handleSelectCompetition}
                    className="grid grid-cols-[16px_110px_minmax(0,1fr)] md:grid-cols-[16px_110px_minmax(0,1fr)_auto_auto] items-center gap-4 transition-transform duration-300 md:group-hover:-translate-x-14 md:group-hover:mr-1"
                >
                    <div className="flex justify-center">
                        <span
                            className={`
                w-2.5 h-2.5 rounded-full transition-all
                ${isSelected ? 'bg-emerald-500 scale-100' : 'bg-transparent scale-0'}
            `}
                        />
                    </div>

                    {/* Image */}
                    <div className="h-18 w-27.5 overflow-hidden rounded-lg border border-white/70 shadow-sm">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                        <p className="truncate text-text-4 font-semibold text-gray-900">{title}</p>
                        <p className="mt-1 truncate text-text-5 text-gray-600">
                            Kết thúc: {endTimeLabel}
                        </p>

                        {/* Mobile info */}
                        <div className="mt-1.5 flex items-center gap-2 text-text-5 md:hidden">
                            <span className="text-gray-700">Khối {grade ?? '--'}</span>
                            <span className="text-gray-400">•</span>
                            <span className={isAttempted ? 'text-emerald-600 font-medium' : 'text-gray-500'}>
                                {statusLabel}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={(event) => {
                                handleNavigateDetail(event);
                            }}
                            className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-text-5 font-semibold transition-colors md:hidden ${true
                                    ? 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700'
                                    : 'cursor-not-allowed bg-gray-100 text-gray-500'
                                }`}
                        >
                            Xem chi tiết
                        </button>
                    </div>

                    {/* Grade (desktop) */}
                    <div className="hidden text-center text-text-5 font-semibold text-gray-700 md:block">
                        Khối {grade ?? '--'}
                    </div>

                    {/* Status */}
                    <div className="hidden justify-end md:flex">
                        <span
                            className={`rounded-full px-2.5 py-1 text-text-5 font-semibold ${isAttempted
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {statusLabel}
                        </span>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={handleNavigateDetail}
                    className="
        cursor-pointer
        absolute right-0 top-0
        hidden h-full w-14
        translate-x-full
        items-center justify-center
        bg-blue-600 text-white
        md:flex

        opacity-0
        scale-95

        transition-all duration-500
        [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]

        md:group-hover:translate-x-0
        md:group-hover:opacity-100
        md:group-hover:scale-100

        hover:bg-blue-700
        active:scale-95
    "
                    aria-label="Xem chi tiết cuộc thi"
                >
                    <ArrowRight
                        size={20}
                        className="
            transition-transform duration-300
            group-hover:translate-x-1
        "
                    />
                </button>
            </div>
        </article>
    );
};

export default memo(SecondaryCompetitionTableItem);
