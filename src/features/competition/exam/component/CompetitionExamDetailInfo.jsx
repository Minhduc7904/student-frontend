const formatDisplayValue = (value) => {
    if (value == null) return '--';
    if (typeof value === 'string' && !value.trim()) return '--';
    return value;
};

const CompetitionExamDetailInfo = ({ examInfo, sectionsWithQuestions, totalQuestions, loading = false }) => {
    const detailRows = [
        {
            label: 'Tiêu đề đề thi',
            value: formatDisplayValue(examInfo?.title),
        },
        {
            label: 'Khối',
            value: formatDisplayValue(examInfo?.grade),
        },
        {
            label: 'Môn học',
            value: formatDisplayValue(examInfo?.subject?.name),
        },
        {
            label: 'Số phần',
            value: sectionsWithQuestions?.length ?? 0,
        },
        {
            label: 'Số câu hỏi',
            value: totalQuestions ?? 0,
        },
    ];

    return (
        <div className="mt-3 overflow-hidden rounded-xl">
            <div className="w-full">
                <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                    <div className="w-14">#</div>
                    <div className="w-1/3">Label</div>
                    <div className="flex-1 text-end">Giá trị</div>
                </div>

                <div className="mt-2 flex flex-col gap-0.5">
                    {loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={`exam-detail-skeleton-${index + 1}`}
                                className="
                                flex items-center
                                rounded-xl border border-transparent
                                bg-[#fafbfd]
                                px-4 py-2
                                even:bg-[#f6f8fb]
                                "
                            >
                                {/* index */}
                                <div className="w-14">
                                    <div className="h-4 w-5 rounded bg-gray-100 animate-pulse" />
                                </div>

                                {/* label */}
                                <div className="w-1/3">
                                    <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
                                </div>

                                {/* value */}
                                <div className="flex-1 flex justify-end">
                                    <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
                                </div>
                            </div>
                        ))
                        : detailRows.map((item, index) => (
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

                                <div className="w-1/3 text-sm text-gray-700">
                                    {item.label}:
                                </div>

                                <div className="flex-1 text-end text-sm font-semibold text-gray-900">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CompetitionExamDetailInfo;
