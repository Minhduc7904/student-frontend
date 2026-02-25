import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PageLoading } from '../../shared/components/loading';
import { ROUTES } from '../../core/constants';
import {
    startCompetitionAttempt,
    selectStartAttemptLoading,
    selectCurrentAttempt
} from './store/doCompetitionSlice';
import { AlertCircle, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

/**
 * Confirmation Modal Component
 * Modal hiển thị lưu ý trước khi bắt đầu làm bài
 */
const ConfirmationModal = ({ onConfirm, onCancel }) => {
    const warnings = [
        'Không thoát trang hoặc tải lại trang khi đang làm bài',
        'Không chuyển sang ứng dụng khác trong thời gian làm bài',
        'Hệ thống có thể tự động nộp bài nếu phát hiện gián đoạn',
        'Hãy đảm bảo kết nối mạng ổn định trước khi bắt đầu',
        'Thời gian làm bài sẽ được tính ngay sau khi bắt đầu'
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <Info className="w-7 h-7 text-blue-800" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-h2 text-gray-900">
                                Lưu ý trước khi làm bài
                            </h2>
                            <p className="text-text-4 text-gray-600">
                                Vui lòng đọc kỹ các lưu ý dưới đây
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex flex-col gap-3">
                            {warnings.map((warning, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-text-5 font-semibold">{index + 1}</span>
                                    </div>
                                    <p className="text-text-4 text-gray-900 flex-1">
                                        {warning}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-subhead-4 transition-all active:scale-95"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-subhead-4 transition-all active:scale-95"
                    >
                        Bắt đầu làm bài
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Status Message Component
 * Hiển thị thông báo kết quả (success/error) giữa màn hình
 */
const StatusMessage = ({ type, title, message, onRetry, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-16 h-16 text-green-500" />,
        error: <XCircle className="w-16 h-16 text-red-500" />,
        warning: <AlertCircle className="w-16 h-16 text-yellow-500" />,
        info: <Clock className="w-16 h-16 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-50',
        error: 'bg-red-50',
        warning: 'bg-yellow-50',
        info: 'bg-blue-50'
    };

    const borderColors = {
        success: 'border-green-200',
        error: 'border-red-200',
        warning: 'border-yellow-200',
        info: 'border-blue-200'
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className={`max-w-md w-full ${bgColors[type]} border-2 ${borderColors[type]} rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300`}>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    {icons[type]}
                </div>

                {/* Title */}
                <h2 className="text-h2 text-gray-900 text-center mb-3">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-text-4 text-gray-700 text-center mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {onRetry && type === 'error' && (
                        <button
                            onClick={onRetry}
                            className="w-full px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-subhead-4 transition-all active:scale-95"
                        >
                            Thử lại
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className={`w-full px-6 py-3 rounded-lg text-subhead-4 transition-all active:scale-95 ${type === 'error'
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                : 'bg-blue-800 hover:bg-blue-900 text-white'
                                }`}
                        >
                            Đóng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Do Competition Start Page
 * Trang bắt đầu làm bài thi - kiểm tra điều kiện và khởi tạo attempt
 */
export const DoCompetitionStart = ({ isHomeworkCompetition = false }) => {
    const { competitionId, courseId, lessonId, learningItemId, homeworkContentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loading = useSelector(selectStartAttemptLoading);
    const currentAttempt = useSelector(selectCurrentAttempt);

    const [showConfirmModal, setShowConfirmModal] = useState(true);
    const [status, setStatus] = useState({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    const handleStartAttempt = async () => {
        setShowConfirmModal(false); // Đóng modal xác nhận

        try {
            const result = await dispatch(startCompetitionAttempt(competitionId)).unwrap();

            // Success case
            if (result.success) {
                const { data } = result;

                // Kiểm tra có competitionSubmitId và isInProgress
                if (data?.competitionSubmitId && data?.isInProgress) {
                    // Navigate trực tiếp đến trang làm bài
                    if (isHomeworkCompetition) {
                        navigate(ROUTES.DO_HOMEWORK_COMPETITION_SUBMIT(
                            courseId,
                            lessonId,
                            learningItemId,
                            homeworkContentId,
                            data.competitionId,
                            data.competitionSubmitId
                        ));
                    } else {
                        navigate(ROUTES.DO_COMPETITION_SUBMIT(data.competitionId, data.competitionSubmitId));
                    }
                } else {
                    // Hiển thị thông báo nếu không có điều kiện để làm bài
                    setStatus({
                        show: true,
                        type: 'warning',
                        title: 'Không thể tiếp tục',
                        message: data?.message || 'Bài thi không ở trạng thái có thể làm'
                    });
                }
            } else {
                // API trả về success: false
                setStatus({
                    show: true,
                    type: 'error',
                    title: 'Không thể bắt đầu',
                    message: result.message || 'Đã có lỗi xảy ra'
                });
            }
        } catch (error) {
            // Error từ API hoặc network
            const errorMessage = error?.message || error?.data?.message || 'Không thể kết nối đến máy chủ';

            setStatus({
                show: true,
                type: 'error',
                title: 'Lỗi',
                message: errorMessage
            });
        }
    };

    const handleRetry = () => {
        setStatus({ ...status, show: false });
        handleStartAttempt();
    };

    const handleClose = () => {
        // Quay về trang trước hoặc trang chủ
        if (isHomeworkCompetition) {
            navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItemId));
        }
        else navigate(-1);
    };

    const handleCancelConfirm = () => {
        if (isHomeworkCompetition) {
            navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItemId));
        }
        else navigate(-1);
    };

    // Hiển thị confirmation modal
    if (showConfirmModal) {
        return (
            <ConfirmationModal
                onConfirm={handleStartAttempt}
                onCancel={handleCancelConfirm}
            />
        );
    }

    // Hiển thị loading khi đang kiểm tra
    if (loading && !status.show) {
        return <PageLoading message="Đang kiểm tra điều kiện làm bài..." />;
    }

    // Hiển thị status message
    if (status.show) {
        return (
            <StatusMessage
                type={status.type}
                title={status.title}
                message={status.message}
                onRetry={status.type === 'error' ? handleRetry : null}
                onClose={handleClose}
            />
        );
    }

    return null;
};

export default DoCompetitionStart;
