import { memo } from 'react';
import PropTypes from 'prop-types';
import { Send, ArrowLeft, AlertTriangle, CheckCircle, CircleDot, CircleAlert } from 'lucide-react';

/**
 * Stat row inside submit confirmation
 */
const StatRow = ({ icon: Icon, label, value, total, iconColor, valueColor }) => (
    <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
        <span className="text-text-5 text-gray-700 flex-1">{label}</span>
        <span className={`text-subhead-5 ${valueColor}`}>{value}/{total}</span>
    </div>
);

/**
 * ConfirmModal
 * Modal xác nhận trước khi nộp bài hoặc quay lại
 */
export const ConfirmModal = memo(({
    open,
    type,
    onConfirm,
    onCancel,
    submitLoading = false,
    totalQuestions = 0,
    totalAnswered = 0,
    totalErrors = 0,
}) => {
    if (!open) return null;

    const isSubmit = type === 'submit';
    const unanswered = Math.max(0, totalQuestions - totalAnswered);

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

            {/* Modal */}
            <div className="relative max-w-sm w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Accent bar */}
                <div className={`h-1 ${isSubmit ? 'bg-blue-800' : 'bg-gray-300'}`} />

                <div className="px-5 sm:px-6 pt-6 pb-5 sm:pb-6 flex flex-col gap-4">
                    {/* Icon + Title */}
                    <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSubmit ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                            {isSubmit
                                ? <Send className="w-5 h-5 text-blue-800" />
                                : <ArrowLeft className="w-5 h-5 text-yellow-600" />
                            }
                        </div>
                        <h3 className="text-h3 text-gray-900 text-center">
                            {isSubmit ? 'Xác nhận nộp bài' : 'Xác nhận quay lại'}
                        </h3>
                        <p className="text-text-5 sm:text-text-4 text-gray-500 text-center">
                            {isSubmit
                                ? 'Bạn chắc chắn muốn nộp bài? Sau khi nộp sẽ không thể chỉnh sửa.'
                                : 'Bạn muốn rời khỏi bài thi? Bài làm của bạn vẫn sẽ được lưu.'
                            }
                        </p>
                    </div>

                    {/* Stats summary (only for submit) */}
                    {isSubmit && totalQuestions > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3.5 flex flex-col gap-2">
                            <StatRow
                                icon={CheckCircle}
                                label="Đã trả lời"
                                value={totalAnswered}
                                total={totalQuestions}
                                iconColor="text-emerald-500"
                                valueColor="text-emerald-700"
                            />
                            <StatRow
                                icon={CircleDot}
                                label="Chưa trả lời"
                                value={unanswered}
                                total={totalQuestions}
                                iconColor="text-gray-400"
                                valueColor="text-gray-600"
                            />
                            {totalErrors > 0 && (
                                <StatRow
                                    icon={CircleAlert}
                                    label="Lỗi"
                                    value={totalErrors}
                                    total={totalQuestions}
                                    iconColor="text-red-500"
                                    valueColor="text-red-600"
                                />
                            )}
                            {unanswered > 0 && (
                                <div className="flex items-start gap-2 mt-1 px-1">
                                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                                    <span className="text-text-5 text-yellow-600">
                                        Bạn còn {unanswered} câu chưa trả lời
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Go-back warning */}
                    {!isSubmit && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3.5 flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                            <span className="text-text-5 text-yellow-700">
                                Thời gian làm bài vẫn tiếp tục tính khi bạn rời khỏi.
                            </span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2.5 sm:gap-3">
                        <button
                            onClick={onCancel}
                            disabled={submitLoading}
                            className="cursor-pointer flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-text-5 sm:text-subhead-4 font-medium transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={submitLoading}
                            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-text-5 sm:text-subhead-4 font-semibold transition-all active:scale-[0.98] disabled:opacity-70 ${
                                isSubmit
                                    ? 'bg-blue-800 hover:bg-blue-900 text-white'
                                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            }`}
                        >
                            {isSubmit ? (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    {submitLoading ? 'Đang nộp...' : 'Nộp bài'}
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Rời khỏi
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

ConfirmModal.propTypes = {
    open: PropTypes.bool,
    type: PropTypes.oneOf(['submit', 'goback']),
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    submitLoading: PropTypes.bool,
    totalQuestions: PropTypes.number,
    totalAnswered: PropTypes.number,
    totalErrors: PropTypes.number,
};

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
