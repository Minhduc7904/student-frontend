import { memo } from 'react';
import Tilt from 'react-parallax-tilt';

const formatRoundedExamCount = (count) => {
    const numericCount = Number(count) || 0;

    if (numericCount <= 0) {
        return '0 đề thi';
    }

    if (numericCount < 10) {
        return `${numericCount} đề thi`;
    }

    const roundedBase = 10 ** (String(Math.floor(numericCount)).length - 1);
    const roundedValue = Math.floor(numericCount / roundedBase) * roundedBase;

    return `${roundedValue}+ đề thi`;
};

/**
 * ExamTypeCard
 * Card chon loai đề thi trong trang /exams.
 */
const ExamTypeCard = ({
    title,
    imageSrc,
    examCount = 0,
    selected = false,
    onClick,
    gradientFrom,
    gradientTo,
    darkText = false,
}) => {
    const textPrimaryClass = darkText ? 'text-gray-900' : 'text-white';
    const textSecondaryClass = darkText ? 'text-gray-700' : 'text-white/85';
    const examCountLabel = formatRoundedExamCount(examCount);

    return (
        <Tilt
            className="w-full rounded-2xl"
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            perspective={1000}
            transitionSpeed={700}
            scale={1.03}
            glareEnable={true}
            glareMaxOpacity={0.35}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="1rem"
            glareReverse={true}
        >
            <button
                type="button"
                onClick={onClick}
                className={`cursor-pointer group relative flex h-full aspect-2/1 w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all md:p-4 ${selected
                    ? 'border-white/85 ring-2 ring-blue-300 shadow-lg'
                    : 'border-white/45 shadow-md hover:shadow-lg'
                    }`}
                style={{
                    backgroundImage: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                }}
            >
                <div className="absolute inset-0 bg-black/5" aria-hidden="true" />

                <div className="relative flex min-w-0 h-full flex-col justify-between py-0.5">
                    <p className={`text-sm font-semibold md:text-base ${textPrimaryClass}`}>
                        {title}
                    </p>

                    <div className="mt-1">
                        <p className={`text-xs md:text-sm ${textSecondaryClass}`}>
                            {examCountLabel}
                        </p>

                        <span className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold md:text-sm ${darkText
                            ? 'bg-white/70 text-gray-900'
                            : 'bg-white/25 text-white'
                            }`}>
                            Xem ngay
                        </span>
                    </div>
                </div>

                <img
                    src={imageSrc}
                    alt={title}
                    className="relative h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
                    loading="lazy"
                />
            </button>
        </Tilt>
    );
};

export default memo(ExamTypeCard);
