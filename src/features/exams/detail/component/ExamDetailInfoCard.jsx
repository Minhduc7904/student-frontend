import { memo, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../../../shared/components';

const ExamDetailInfoCard = ({ title, examDetail, id, typeexam, onBack }) => {
    const creatorName = examDetail?.createdByAdmin?.fullName || '--';
    const creatorAvatar = examDetail?.createdByAdmin?.avatarUrl || examDetail?.createdByAdmin?.avatar || '';
    const creatorInitial = creatorName && creatorName !== '--' ? creatorName.trim().charAt(0).toUpperCase() : 'A';

    const infoRows = useMemo(
        () => [
            {
                label: 'Môn học',
                value: examDetail?.subjectName || '--',
            },
            {
                label: 'Số câu hỏi',
                value: examDetail?.questionCount ?? 0,
            },
            {
                label: 'Khối',
                value: examDetail?.grade ?? '--',
            },
            {
                label: 'Người tạo',
                value: (
                    <div className="inline-flex items-center gap-2">
                        {creatorAvatar
                            ? (
                                <img
                                    src={creatorAvatar}
                                    alt={creatorName}
                                    className="h-8 w-8 rounded-full object-cover"
                                    loading="lazy"
                                />
                            )
                            : (
                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                    {creatorInitial}
                                </div>
                            )}

                        <span>{creatorName}</span>
                    </div>
                ),
            },
        ],
        [creatorAvatar, creatorInitial, creatorName, examDetail?.grade, examDetail?.questionCount, examDetail?.subjectName]
    );

    return (
        <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>

                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                    <ArrowLeft size={15} />
                    Quay lại
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
                    <h2 className="text-h4 text-gray-900">Thông tin cơ bản</h2>

                    <div className="mt-3 overflow-hidden rounded-xl">
                        <div className="w-full">
                            <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                                <div className="w-14">#</div>
                                <div className="w-1/3">Label</div>
                                <div className="flex-1 text-end">Giá trị</div>
                            </div>

                            <div className="mt-2 flex flex-col gap-0.5">
                                {infoRows.map((item, index) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 transition-colors duration-200 even:bg-[#f1f5f9]"
                                    >
                                        <div className="w-14 text-sm font-medium text-gray-600">
                                            {index + 1}
                                        </div>

                                        <div className="w-1/3 text-sm text-gray-700">
                                            {item.label}:
                                        </div>

                                        <div className="flex flex-1 items-center justify-end text-sm font-semibold text-gray-900">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Mô tả</p>
                    <p className="text-sm leading-6 text-slate-700">
                        {examDetail?.description || 'Chưa có mô tả cho đề thi này.'}
                    </p>

                    <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <p>Mã đề: {examDetail?.examId ?? id}</p>
                        <p>Loại đề: {typeexam || '--'}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default memo(ExamDetailInfoCard);
