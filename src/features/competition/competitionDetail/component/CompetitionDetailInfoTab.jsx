import { useSelector } from 'react-redux';
import { selectCompetitionDetail } from '../store';
import MarkdownRenderer from '../../../../shared/components/markdown/MarkdownRenderer';
import { DEFAULT_COMPETITION_POLICIES } from '../../../../shared/constants';

const TIMELINE_STATUS_LABELS = {
    ONGOING: 'Đang diễn ra',
    UPCOMING: 'Sắp diễn ra',
    ENDED: 'Đã kết thúc',
};

const ATTEMPT_STATUS_LABELS = {
    ATTEMPTED: 'Đã làm bài',
    NOT_ATTEMPTED: 'Chưa làm bài',
    NOT_STARTED: 'Chưa bắt đầu',
    IN_PROGRESS: 'Đang làm bài',
    SUBMITTED: 'Đã nộp bài',
    EXPIRED: 'Đã hết hạn',
};

const TIMELINE_STATUS_CLASSES = {
    ONGOING: 'text-emerald-700',
    UPCOMING: 'text-amber-700',
    ENDED: 'text-rose-700',
};

const ATTEMPT_STATUS_CLASSES = {
    ATTEMPTED: 'text-emerald-700',
    NOT_ATTEMPTED: 'text-slate-600',
    NOT_STARTED: 'text-slate-600',
    IN_PROGRESS: 'text-sky-700',
    SUBMITTED: 'text-indigo-700',
    EXPIRED: 'text-rose-700',
};

const toVietnameseStatus = (status, labels) => {
    if (!status) return '--';
    return labels[status] ?? status.replaceAll('_', ' ').toLowerCase();
};

const getStatusClass = (status, classMap) => {
    if (!status) return 'text-gray-900';
    return classMap[status] ?? 'text-gray-900';
};

const CompetitionDetailInfoTab = ({ detail: detailProp }) => {
    const detailFromStore = useSelector(selectCompetitionDetail);
    const detail = detailProp ?? detailFromStore;
    const normalizedPolicies = typeof detail?.policies === 'string'
        ? detail.policies
        : Array.isArray(detail?.policies)
            ? detail.policies.join('\n\n')
            : '';
    const policiesContent = normalizedPolicies?.trim() || DEFAULT_COMPETITION_POLICIES;

    const infoRows = [
        {
            label: 'Trạng thái thời gian',
            value: toVietnameseStatus(detail?.timelineStatus, TIMELINE_STATUS_LABELS),
            valueClass: getStatusClass(detail?.timelineStatus, TIMELINE_STATUS_CLASSES),
        },
        {
            label: 'Trạng thái làm bài',
            value: toVietnameseStatus(detail?.attemptStatus, ATTEMPT_STATUS_LABELS),
            valueClass: getStatusClass(detail?.attemptStatus, ATTEMPT_STATUS_CLASSES),
        },
        {
            label: 'Số lần đã làm',
            value: detail?.attemptedCount ?? 0,
            valueClass: 'text-gray-900',
        },
        {
            label: 'Thời lượng (phút)',
            value: detail?.durationMinutes ?? '--',
            valueClass: 'text-gray-900',
        },
        {
            label: 'Tối đa lượt làm',
            value: detail?.maxAttempts ?? '--',
            valueClass: 'text-gray-900',
        },
        {
            label: 'Có thể làm bài',
            value: detail?.attemptStatus === 'IN_PROGRESS'
                ? 'Đang làm bài'
                : detail?.canAttempt
                    ? 'Có'
                    : 'Không',
            valueClass: 'text-gray-900',
        },
    ];

    return (
        <section className="mt-5">
            <div className='rounded-2xl border border-gray-100 bg-white p-4 md:p-5'>
                <h2 className="text-h4 text-gray-900">Thông tin cuộc thi</h2>
                <div className="mt-3 overflow-hidden rounded-xl">
                    <div className="w-full">
                        {/* Header */}
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                            <div className="w-14">#</div>
                            <div className="w-1/3">Label</div>
                            <div className="flex-1 text-end">Giá trị</div>
                        </div>

                        {/* Body */}
                        <div className="mt-2 flex flex-col gap-0.5">
                            {infoRows.map((item, index) => (
                                <div
                                    key={item.label}
                                    className="
                        flex items-center
                        rounded-xl border border-transparent
                        bg-[#f8fafc]
                        px-4 py-2
                        transition-colors duration-200
                        even:bg-[#f1f5f9]
                    "
                                >
                                    <div className="w-14 text-sm font-medium text-gray-600">
                                        {index + 1}
                                    </div>

                                    <div className="w-1/3 text-sm  text-gray-700">
                                        {item.label}:
                                    </div>

                                    <div className={`flex-1 text-sm text-end font-semibold ${item.valueClass}`}>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            {/* <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
                <MarkdownRenderer
                    content={policiesContent}
                    className="mt-3 text-sm text-gray-700"
                />
            </div> */}
        </section>
    );
};

export default CompetitionDetailInfoTab;
