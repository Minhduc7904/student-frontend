import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Play, X } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import {
    selectStartAttemptLoading,
    startCompetitionAttempt,
} from '../../do-competition/store';

const CompetitionStartModal = ({ isOpen, competitionId, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectStartAttemptLoading);
    const [status, setStatus] = useState(null);

    if (!isOpen) return null;

    const handleStartNow = async () => {
        if (!competitionId || loading) return;

        setStatus(null);

        try {
            const result = await dispatch(startCompetitionAttempt(competitionId)).unwrap();

            if (result?.success) {
                const data = result?.data;

                if (data?.competitionSubmitId && data?.isInProgress) {
                    onClose?.();
                    navigate(
                        ROUTES.DO_COMPETITION_SUBMIT(
                            data.competitionId,
                            data.competitionSubmitId
                        )
                    );
                    return;
                }

                setStatus({
                    type: 'warning',
                    message: data?.message || 'Bài thi chưa sẵn sàng để bắt đầu.',
                });
                return;
            }

            setStatus({
                type: 'error',
                message: result?.message || 'Không thể bắt đầu cuộc thi.',
            });
        } catch (error) {
            setStatus({
                type: 'error',
                message:
                    error?.message ||
                    error?.data?.message ||
                    'Lỗi kết nối máy chủ.',
            });
        }
    };

    const isWarning = status?.type === 'warning';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#f5f7fb] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-200 p-5">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            Bắt đầu làm bài
                            <span>🧠</span>
                        </h3>

                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                            Bạn đã sẵn sàng để bắt đầu làm bài thi chưa? Hãy đảm bảo rằng bạn đã chuẩn bị tốt và có kết nối internet ổn định trước khi bắt đầu.
                        </p>
                    </div>
                </div>

                {/* Alert */}
                {status?.message && (
                    <div
                        className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2 text-sm ${isWarning
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-600 border border-red-200'
                            }`}
                    >
                        {isWarning ? (
                            <Lock size={16} className="mt-0.5" />
                        ) : (
                            <AlertCircle size={16} className="mt-0.5" />
                        )}
                        <span>{status.message}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="cursor-pointer px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    >
                        Để sau
                    </button>

                    <button
                        onClick={handleStartNow}
                        disabled={loading}
                        className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-1.5"
                    >
                        <Play size={14} />
                        {loading ? 'Đang xử lý...' : 'Bắt đầu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompetitionStartModal;