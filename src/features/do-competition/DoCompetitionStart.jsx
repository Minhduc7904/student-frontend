import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PageLoading } from '../../shared/components/loading';
import { Logo } from '../../shared/components';
import { ROUTES } from '../../core/constants';
import {
    startCompetitionAttempt,
    selectStartAttemptLoading,
    selectCurrentAttempt
} from './store/doCompetitionSlice';
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    ShieldAlert,
    Wifi,
    MonitorX,
    Timer,
    RefreshCcw,
    ArrowLeft,
    Play,
    ChevronLeft
} from 'lucide-react';

// ─── Warning Item ────────────────────────────────────────────────────────────
const WarningItem = ({ icon: Icon, text, index }) => (
    <div className="flex items-start gap-3 sm:gap-4 group">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-800 group-hover:text-white transition-colors">
            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-800 group-hover:text-white transition-colors" />
        </div>
        <p className="text-text-5 sm:text-text-4 text-gray-800 flex-1 pt-1.5">
            {text}
        </p>
    </div>
);

// ─── Confirmation Page ───────────────────────────────────────────────────────
const ConfirmationPage = ({ onConfirm, onCancel, loading }) => {
    const warnings = [
        { icon: MonitorX, text: 'Không thoát trang hoặc tải lại trang khi đang làm bài' },
        { icon: ShieldAlert, text: 'Không chuyển sang ứng dụng khác trong thời gian làm bài' },
        { icon: AlertCircle, text: 'Hệ thống có thể tự động nộp bài nếu phát hiện gián đoạn' },
        { icon: Wifi, text: 'Hãy đảm bảo kết nối mạng ổn định trước khi bắt đầu' },
        { icon: Timer, text: 'Thời gian làm bài sẽ được tính ngay sau khi bắt đầu' },
    ];

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            {/* Header bar */}
            <header className="bg-white border-b border-gray-100 shadow-sm shrink-0">
                <div className="max-w-3xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
                    <Logo
                        mode="default"
                        containerClassName="flex items-center"
                        className="h-8 sm:h-10 w-auto object-contain"
                    />
                    <button
                        onClick={onCancel}
                        className="flex cursor-pointer items-center gap-1.5 text-text-5 sm:text-subhead-5 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Quay lại
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="max-w-lg w-full flex flex-col gap-6 sm:gap-8">
                    {/* Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Card header accent */}
                        <div className="h-1.5 bg-linear-to-r from-blue-800 to-blue-cyan" />

                        {/* Card body */}
                        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col gap-5 sm:gap-6">
                            {/* Title area */}
                            <div className="flex flex-col gap-1.5 sm:gap-2 text-center">
                                <h1 className="text-h3 sm:text-h2 text-gray-900">
                                    Lưu ý trước khi làm bài
                                </h1>
                                <p className="text-text-5 sm:text-text-4 text-gray-500">
                                    Vui lòng đọc kỹ các lưu ý dưới đây trước khi bắt đầu
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100" />

                            {/* Warnings */}
                            <div className="flex flex-col gap-3.5 sm:gap-4">
                                {warnings.map((w, i) => (
                                    <WarningItem key={i} icon={w.icon} text={w.text} index={i} />
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100" />

                            {/* Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                                <button
                                    onClick={onCancel}
                                    disabled={loading}
                                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-text-5 sm:text-subhead-4 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Hủy
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-text-5 sm:text-subhead-4 transition-all active:scale-[0.98] shadow-sm disabled:opacity-70"
                                >
                                    <Play className="w-4 h-4" />
                                    Bắt đầu làm bài
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ─── Status Page ─────────────────────────────────────────────────────────────
const StatusPage = ({ type, title, message, onRetry, onClose }) => {
    const config = {
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-500',
            accentBg: 'bg-green-100',
            accentGradient: 'from-green-500 to-green-500',
        },
        error: {
            icon: XCircle,
            iconColor: 'text-red-600',
            accentBg: 'bg-red-100',
            accentGradient: 'from-red-500 to-red-400',
        },
        warning: {
            icon: AlertCircle,
            iconColor: 'text-yellow-500',
            accentBg: 'bg-yellow-100',
            accentGradient: 'from-yellow-500 to-yellow-500',
        },
        info: {
            icon: Clock,
            iconColor: 'text-blue-800',
            accentBg: 'bg-blue-100',
            accentGradient: 'from-blue-800 to-blue-cyan',
        },
    };

    const current = config[type] || config.info;
    const IconComponent = current.icon;

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            {/* Header bar */}
            <header className="bg-white border-b border-gray-100 shadow-sm shrink-0">
                <div className="max-w-3xl mx-auto flex items-center h-14 sm:h-16 px-4 sm:px-6">
                    <Logo
                        mode="default"
                        containerClassName="flex items-center"
                        className="h-8 sm:h-10 w-auto object-contain"
                    />
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Accent bar */}
                        <div className={`h-1.5 bg-linear-to-r ${current.accentGradient}`} />

                        <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8 flex flex-col items-center gap-4 sm:gap-5">
                            {/* Icon */}
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${current.accentBg} flex items-center justify-center`}>
                                <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${current.iconColor}`} />
                            </div>

                            {/* Title */}
                            <h2 className="text-h3 sm:text-h2 text-gray-900 text-center">
                                {title}
                            </h2>

                            {/* Message */}
                            <p className="text-text-5 sm:text-text-4 text-gray-500 text-center leading-relaxed">
                                {message}
                            </p>

                            {/* Divider */}
                            <div className="w-full h-px bg-gray-100 mt-1" />

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                {onRetry && type === 'error' && (
                                    <button
                                        onClick={onRetry}
                                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-text-5 sm:text-subhead-4 transition-all active:scale-[0.98] shadow-sm"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Thử lại
                                    </button>
                                )}
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl text-text-5 sm:text-subhead-4 transition-all active:scale-[0.98] ${
                                            type === 'error' && onRetry
                                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                : 'bg-blue-800 hover:bg-blue-900 text-white shadow-sm'
                                        }`}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Quay lại
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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

    const [showConfirmPage, setShowConfirmPage] = useState(true);
    const [status, setStatus] = useState({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    const handleStartAttempt = async () => {
        setShowConfirmPage(false);

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

    // Hiển thị confirmation page
    if (showConfirmPage) {
        return (
            <ConfirmationPage
                onConfirm={handleStartAttempt}
                onCancel={handleCancelConfirm}
                loading={loading}
            />
        );
    }

    // Hiển thị loading khi đang kiểm tra
    if (loading && !status.show) {
        return <PageLoading message="Đang kiểm tra điều kiện làm bài..." />;
    }

    // Hiển thị status page
    if (status.show) {
        return (
            <StatusPage
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
