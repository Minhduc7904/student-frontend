import { memo } from "react";
import { ArrowDown, ArrowUp, CalendarDays } from "lucide-react";
import {
    METADATA_LABELS,
    REFERENCE_LABELS,
    SOURCE_LABELS,
    formatDateTime,
    formatLabel,
    formatMetadataValue,
    formatNumber,
    getMetadataEntries,
    toSafeNumber,
    translateNote,
} from "./pointLogFormat";

const PointLogItem = memo(({ log }) => {
    const signedPoints = toSafeNumber(log?.signedPoints ?? log?.points);
    const isBonus = log?.type === "BONUS" || signedPoints >= 0;
    const referenceLabel = formatLabel(log?.referenceType, REFERENCE_LABELS);
    const metadataEntries = getMetadataEntries(log?.metadata);

    return (
        <article className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                                isBonus
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {isBonus ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                            {isBonus ? "Cộng điểm" : "Trừ điểm"}
                        </span>
                        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800">
                            {formatLabel(log?.source, SOURCE_LABELS)}
                        </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-blue-950">
                        {translateNote(log)}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} />
                            {formatDateTime(log?.createdAt)}
                        </span>
                        {log?.referenceId ? (
                            <span>
                                {referenceLabel} #{log.referenceId}
                            </span>
                        ) : null}
                    </div>

                    {metadataEntries.length ? (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {metadataEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-2"
                                >
                                    <p className="text-[11px] font-medium text-gray-500">
                                        {METADATA_LABELS[key] || key}
                                    </p>
                                    <p className="mt-0.5 text-xs font-semibold text-blue-950">
                                        {formatMetadataValue(key, value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className={`text-right text-xl font-bold ${isBonus ? "text-green-600" : "text-red-600"}`}>
                    {isBonus ? "+" : "-"}
                    {formatNumber(Math.abs(signedPoints))}
                </div>
            </div>
        </article>
    );
});

PointLogItem.displayName = "PointLogItem";

export { PointLogItem };
