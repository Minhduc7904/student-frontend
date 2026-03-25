import { memo } from 'react';
import { DEFAULT_IMAGES } from '../../../shared/constants';
import './ranking-card-item.css';

const RankingCardItem = ({
    rank,
    fullName,
    avatarUrl,
    scoreLabel,
    attemptLabel,
    timeLabel,
    entryDelay = 0,
    className = '',
}) => {
    return (
        <article
            className={`ranking-entry inline-flex h-16 w-full cursor-pointer items-center gap-4 rounded-2xl border border-[rgba(226,232,240,0.6)] bg-[rgba(255,255,255,0.85)] px-4 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all duration-200 hover:border-[#a1a1aa] hover:bg-white ${className}`}
            style={{ animationDelay: `${entryDelay}ms`, '--ranking-entry-delay': `${entryDelay}ms` }}
        >
            <div className="flex w-full flex-1 items-center gap-4">
                <div className="flex justify-start">
                    <div className="inline-flex w-5 flex-col items-center justify-center overflow-hidden rounded-[999px] bg-[#f1f5f9] text-[#334155]">
                        <div className="self-stretch text-center text-xs leading-5">{rank}</div>
                    </div>
                </div>

                <div className="flex flex-1 items-center gap-3 overflow-hidden">
                    <img
                        className="
        h-7 w-7 shrink-0 rounded-full
        object-cover
        outline -outline-offset-[0.5px]
        outline-[rgba(226,232,240,0.8)]
    "
                        alt={fullName}
                        loading="lazy"
                        src={avatarUrl || DEFAULT_IMAGES.USER_AVATAR}
                        style={{ outlineWidth: 1 }}
                    />

                    <div className="flex min-w-0 flex-1 items-center justify-between overflow-hidden">
                        <div className="flex min-w-0 flex-1 items-center gap-1">
                            <div className="text-sm font-medium leading-5 text-[#0f172a] wrap-break-word">
                                {fullName}
                            </div>
                        </div>

                        <div className="ml-3 flex shrink-0 items-center justify-end">
                            <div className="inline-flex h-10 flex-col items-end justify-center text-xs">
                                <div className="inline-flex items-center justify-start gap-0.5">
                                    <div className="line-clamp-1 leading-4 text-[#64748b]">Điểm:</div>
                                    <div className="line-clamp-1 min-w-10 text-right leading-4 text-[#1e293b]">{scoreLabel}</div>
                                </div>
                                <div className="inline-flex items-center justify-start gap-0.5">
                                    <div className="line-clamp-1 leading-4 text-[#64748b]">Lần thi:</div>
                                    <div className="line-clamp-1 leading-4 text-[#334155]">{attemptLabel}</div>
                                    <div className="line-clamp-1 leading-4 text-[#94a3b8]">|</div>
                                    <div className="line-clamp-1 leading-4 text-[#64748b]">TG:</div>
                                    <div className="line-clamp-1 leading-4 text-[#334155]">{timeLabel}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default memo(RankingCardItem);