import { memo } from 'react';

const formatPracticeCount = (count) => {
    const numericCount = Number(count) || 0;

    if (numericCount <= 0) return 'Sắp cập nhật';
    if (numericCount < 10) return `${numericCount} lựa chọn`;

    const roundedBase = 10 ** (String(Math.floor(numericCount)).length - 1);
    const roundedValue = Math.floor(numericCount / roundedBase) * roundedBase;
    return `${roundedValue}+ lựa chọn`;
};

const PracticeOptionCard = ({
    title,
    subtitle,
    badge,
    action,
    imageSrc,
    metricCount = 0,
    gradientFrom,
    gradientTo,
    onClick,
    disabled = false,
}) => {
    const countLabel = formatPracticeCount(metricCount);

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`group relative flex min-h-42 w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all md:p-5 ${disabled
                ? 'cursor-not-allowed border-gray-200 opacity-80'
                : 'cursor-pointer border-white/55 shadow-md hover:-translate-y-0.5 hover:shadow-lg'
                }`}
            style={{
                backgroundImage: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            }}
        >
            <div className="pointer-events-none absolute inset-0 bg-black/10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-lg" />

            <div className="relative z-10 flex items-start justify-between gap-3">
                <span className="inline-flex rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white">
                    {badge}
                </span>

                <img
                    src={imageSrc}
                    alt={title}
                    className="h-14 w-14 shrink-0 object-contain transition-transform group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            <div className="relative z-10 mt-4 space-y-2">
                <p className="text-base font-semibold text-white md:text-lg">{title}</p>
                <p className="text-xs leading-relaxed text-white/85 md:text-sm">{subtitle}</p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-white/80 md:text-sm">{countLabel}</span>
                <span className="inline-flex items-center rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white transition group-hover:scale-105 md:text-sm">
                    {action}
                </span>
            </div>
        </button>
    );
};

export default memo(PracticeOptionCard);