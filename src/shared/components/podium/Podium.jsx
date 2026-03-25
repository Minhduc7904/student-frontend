import { memo, useMemo } from 'react';
import { Crown } from 'lucide-react';
import { DEFAULT_IMAGES } from '../../constants';
import './podium.css';

const TOP_ELLIPSE_HEIGHT = 20;
const TOP_ELLIPSE_OFFSET = 10;
const AVATAR_SIZE = 72;
const AVATAR_RING_INNER = 80;
const AVATAR_RING_OUTER = 83;
const HOVER_GROW_SCALE = 1.18;

const RANK_CONFIG = {
    1: {
        color: '#E0B84F',
        bg: '#F6D77A',
    },
    2: {
        color: '#9EA4AA',
        bg: '#D6D9DD',
    },
    3: {
        color: '#B8836A',
        bg: '#E0B199',
    },
};

const Podium = ({
    className = '',
    height = 200,
    width = 80,
    avatarUrl = '',
    avatarAlt = 'Avatar',
    rank = 1,
    hoverGrow = false,
    sprout = true,
    sproutDelay = 0,
    studentName = '',
    totalPoints,
    maxPoints,
    timeSpentSeconds,
}) => {
    const rankStyle = RANK_CONFIG[rank] || RANK_CONFIG[3];

    const containerHeight = useMemo(
        () => height * 1.5 + TOP_ELLIPSE_HEIGHT,
        [height]
    );

    const bodyTop = useMemo(
        () => containerHeight - height,
        [containerHeight, height]
    );

    const avatarTop = useMemo(
        () => bodyTop - AVATAR_SIZE - 6,
        [bodyTop]
    );

    const containerStyle = useMemo(
        () => ({
            width,
            height: containerHeight,
            '--podium-grow-offset': `${height * (HOVER_GROW_SCALE - 1)}px`,
            '--podium-sprout-delay': `${sproutDelay}ms`,
        }),
        [containerHeight, height, sproutDelay, width]
    );

    const bodyStyle = useMemo(
        () => ({
            top: bodyTop,
            height,
            width,
        }),
        [bodyTop, height, width]
    );

    const topStyle = useMemo(
        () => ({
            top: bodyTop - TOP_ELLIPSE_OFFSET,
            height: TOP_ELLIPSE_HEIGHT,
            width,
        }),
        [bodyTop, width]
    );

    const avatarRingOuterStyle = useMemo(
        () => ({
            top: avatarTop - 2.5,
            height: AVATAR_RING_OUTER,
            width: AVATAR_RING_OUTER,
            backgroundColor: rankStyle.color,
        }),
        [avatarTop, rankStyle]
    );

    const avatarRingInnerStyle = useMemo(
        () => ({
            top: avatarTop - 4,
            height: AVATAR_RING_INNER,
            width: AVATAR_RING_INNER,
            backgroundColor: rankStyle.bg,
        }),
        [avatarTop, rankStyle]
    );

    const avatarStyle = useMemo(
        () => ({
            top: avatarTop + 4,
            height: AVATAR_SIZE,
            width: AVATAR_SIZE,
        }),
        [avatarTop]
    );

    const rankIconStyle = useMemo(
        () => ({
            top: avatarTop - 20,
            color: rankStyle.color,
            backgroundColor: rankStyle.bg,
        }),
        [avatarTop, rankStyle]
    );

    const scoreTextStyle = useMemo(
        () => ({
            color: rank === 1 ? rankStyle.color : '#1d4ed8',
        }),
        [rank, rankStyle]
    );

    const infoTop = useMemo(
        () => bodyTop - TOP_ELLIPSE_OFFSET + TOP_ELLIPSE_HEIGHT + 4,
        [bodyTop]
    );

    const infoStyle = useMemo(
        () => ({
            top: infoTop,
            width: Math.max(88, width - 6),
        }),
        [infoTop, width]
    );

    // 🎯 chỉ kéo dài lên trên (KHÔNG nhấc)
    const bodyHoverClass = hoverGrow
        ? `origin-bottom transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-[${HOVER_GROW_SCALE}]`
        : 'transition-all duration-300';

    const topEllipseHoverClass = hoverGrow
        ? 'transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transform:translateY(0)] group-hover:[transform:translateY(calc(-1*var(--podium-grow-offset)))]'
        : 'transition-all duration-300';

    // 🎯 avatar + ring + crown đi lên theo độ kéo
    const followGrowClass = hoverGrow
        ? 'left-1/2 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transform:translate(-50%,0)] group-hover:[transform:translate(-50%,calc(-1*var(--podium-grow-offset)))]'
        : 'left-1/2 [transform:translate(-50%,0)]';

    const infoHoverClass = hoverGrow
        ? 'left-1/2 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transform:translate(-50%,0)] group-hover:[transform:translate(-50%,calc(-1*var(--podium-grow-offset)))]'
        : 'left-1/2 [transform:translate(-50%,0)]';

    const sproutClass = sprout ? 'podium-sprout' : '';

    const scoreText =
        totalPoints != null && maxPoints != null
            ? `${totalPoints} / ${maxPoints}`
            : '-- / --';

    const timeText =
        timeSpentSeconds != null
            ? `${Math.floor(Number(timeSpentSeconds) / 60)}:${String(Math.max(0, Number(timeSpentSeconds) % 60)).padStart(2, '0')}`
            : '--:--';

    return (
        <div className={`relative cursor-pointer group ${sproutClass} ${className}`} style={containerStyle}>
            {/* Body */}
            <div
                className={`
                    absolute left-0 z-0
                    bg-linear-to-r
                    from-[#d4d4d4]
                    via-[#f5f5f5]
                    to-[#d4d4d4]
                    ${bodyHoverClass}
                `}
                style={bodyStyle}
            />

            {/* Top ellipse */}
            <div
                className={`
                    absolute left-0 z-10 rounded-full
                    bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,#9A9A9A_16%,#C0C0C0_55%,#E0E0E0_72%,#FFFFFF_100%)]
                    ${topEllipseHoverClass}
                `}
                style={topStyle}
            />

            <div
                className={`absolute shadow-2xl rounded-2xl z-15 bg-white px-1.5 py-1 text-center backdrop-blur-[1px] ${infoHoverClass}`}
                style={infoStyle}
            >
                <p className="text-[10px] font-semibold leading-3 text-gray-900">{studentName || 'Học sinh'}</p>
                <p className="mt-0.5 text-[10px] font-semibold leading-3" style={scoreTextStyle}>{scoreText}</p>
                <p className="mt-0.5 text-[10px] leading-3 text-gray-600">{timeText}</p>
            </div>

            {/* Rings */}
            <div
                className={`absolute rounded-full z-20 ${followGrowClass}`}
                style={avatarRingOuterStyle}
            />
            <div
                className={`absolute rounded-full z-20 ${followGrowClass}`}
                style={avatarRingInnerStyle}
            />

            {/* Avatar */}
            <img
                src={avatarUrl || DEFAULT_IMAGES.USER_AVATAR}
                alt={avatarAlt}
                className={`absolute rounded-full object-cover z-30 ${followGrowClass}`}
                style={avatarStyle}
            />

            {/* Crown */}
            <div
                className={`absolute inline-flex h-6 w-6 items-center justify-center rounded-full z-40 ${followGrowClass}`}
                style={rankIconStyle}
            >
                <Crown size={14} strokeWidth={2.4} className="text-white" />
            </div>
        </div>
    );
};

export { Podium };
export default memo(Podium);