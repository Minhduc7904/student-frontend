import { useMemo } from 'react';
import { formatDateTime } from '../../../../shared/utils/dateUtils';

const CompetitionDetailTimelineDescription = ({ timelineStatus, startDate, endDate, nowTs }) => {
    const startDateLabel = startDate ? formatDateTime(startDate) : 'Không giới hạn';
    const endDateLabel = endDate ? formatDateTime(endDate) : 'Không giới hạn';

    const formatCountdown = (targetDate) => {
        if (!targetDate) return '--:--:--';

        const targetMs = new Date(targetDate).getTime();
        if (Number.isNaN(targetMs)) return '--:--:--';

        const diffMs = Math.max(0, targetMs - nowTs);
        const totalSeconds = Math.floor(diffMs / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');

        if (days > 0) {
            return `${days} ngày ${hh}:${mm}:${ss}`;
        }

        return `${hh}:${mm}:${ss}`;
    };

    const timelineDescription = useMemo(() => {
        if (timelineStatus === 'ONGOING') {
            return `${startDateLabel} / ${formatCountdown(endDate)} đến khi kết thúc kỳ thi`;
        }

        if (timelineStatus === 'UPCOMING') {
            return `${startDateLabel} / ${formatCountdown(startDate)} đến khi bắt đầu kỳ thi`;
        }

        if (timelineStatus === 'ENDED') {
            return `${startDateLabel} / ${endDateLabel} / Đã kết thúc`;
        }

        return startDateLabel;
    }, [timelineStatus, startDateLabel, endDateLabel, startDate, endDate, nowTs]);

    return <p className="mt-1 text-text-4 text-gray-600">{timelineDescription}</p>;
};

export default CompetitionDetailTimelineDescription;