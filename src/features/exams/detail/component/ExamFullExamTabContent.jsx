import { memo } from 'react';
import { Info } from 'lucide-react';

const ExamFullExamTabContent = ({ onStart, disabled = false, loading = false }) => {
    return (
        <>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2 text-amber-800">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p className="text-sm">
                        Sẵn sàng để bắt đầu làm full đề? Để đạt được kết quả tốt nhất, bạn cần dành ra 90 phút cho đề này.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onStart}
                disabled={disabled || loading}
                className="cursor-pointer mt-3 inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? 'Đang bắt đầu...' : 'Bắt đầu làm bài'}
            </button>
        </>
    );
};

export default memo(ExamFullExamTabContent);
