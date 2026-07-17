import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PageLoading } from '../../shared/components/loading';
import { Logo } from '../../shared/components';
import { ROUTES } from '../../core/constants';
import { getActiveAttempt } from './utils/getActiveAttempt';
import {
    getLatestSubmittedAttemptId,
    navigateToCompetitionResult,
    shouldNavigateToCompetitionResult,
} from './utils/attemptResultNavigation';
import {
    startCompetitionAttempt,
    resetCompetitionAttemptState,
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
        { icon: MonitorX, text: 'Không tải lại hoặc đóng trang trong khi đang làm bài.' },
        { icon: ShieldAlert, text: 'Mỗi lượt làm bài chỉ được ghi nhận một lần.' },
        { icon: Timer, text: 'Đồng hồ bắt đầu ngay khi bạn vào phòng thi.' },
    ];

    return (
        <div className="min-h-dvh bg-blue-50/70 text-blue-950">
            <header className="border-b border-blue-700 bg-blue-800 text-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Logo
                        mode="default"
                        containerClassName="flex items-center"
                        className="h-8 w-auto brightness-0 invert sm:h-9"
                    />
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Rời trang
                    </button>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-6 lg:py-12">
                <div className="grid w-full overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_20px_55px_rgba(25,77,182,0.12)] lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="p-6 sm:p-9 lg:p-12">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-bold text-blue-950">
                            <Clock className="h-4 w-4" />
                            Chuẩn bị vào phòng thi
                        </div>
                        <h1 className="mt-5 max-w-xl text-h2 leading-tight text-blue-950 sm:text-h1">Sẵn sàng làm bài?</h1>
                        <p className="mt-3 max-w-xl text-text-4 leading-7 text-gray-600">Hệ thống sẽ kiểm tra lượt làm bài và đồng bộ thời gian từ máy chủ trước khi mở đề.</p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                                <Wifi className="h-5 w-5 text-blue-800" />
                                <p className="mt-3 text-sm font-bold text-blue-950">Kết nối ổn định</p>
                                <p className="mt-1 text-sm leading-5 text-gray-600">Đáp án được lưu tự động trong lúc làm bài.</p>
                            </div>
                            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                                <Timer className="h-5 w-5 text-blue-800" />
                                <p className="mt-3 text-sm font-bold text-blue-950">Thời gian chính xác</p>
                                <p className="mt-1 text-sm leading-5 text-gray-600">Đồng hồ dùng thời gian trả về từ máy chủ.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button onClick={onConfirm} disabled={loading} className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70">
                                <Play className="h-4 w-4 fill-current" />
                                {loading ? 'Đang mở phòng thi...' : 'Bắt đầu làm bài'}
                            </button>
                            <button onClick={onCancel} disabled={loading} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-60">
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại
                            </button>
                        </div>
                    </section>

                    <aside className="border-t border-blue-100 bg-blue-950 p-6 text-white sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-yellow-500">Lưu ý quan trọng</p>
                        <div className="mt-6 space-y-5">
                            {warnings.map((warning, index) => (
                                <div className="flex gap-3" key={warning.text}>
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-yellow-500">
                                        <warning.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">0{index + 1}</p>
                                        <p className="mt-0.5 text-sm leading-6 text-blue-100">{warning.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-blue-100">
                            Nếu thời gian đã hết, hệ thống sẽ nộp bài và đưa bạn đến trang kết quả thay vì mở lại đề.
                        </div>
                    </aside>
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

    const navigateToResult = (submitId) => navigateToCompetitionResult({
        navigate,
        isHomeworkCompetition,
        courseId,
        lessonId,
        learningItemId,
        competitionId,
        submitId,
    });

    const navigateAfterStartFailure = async (failure) => {
        if (!shouldNavigateToCompetitionResult(failure)) return false;

        const submitId = failure?.data?.competitionSubmitId ?? failure?.competitionSubmitId ?? await getLatestSubmittedAttemptId(competitionId);
        navigateToResult(submitId);
        return true;
    };

    const handleStartAttempt = async () => {
        setShowConfirmPage(false);

        try {
            const result = await dispatch(startCompetitionAttempt(competitionId)).unwrap();

            // Success case
            if (result.success) {
                const { data } = result;
                const autoSubmittedSubmitId = data?.autoSubmitted
                    ? data?.competitionSubmitId ?? data?.submission?.competitionSubmitId
                    : null;
                if (autoSubmittedSubmitId) {
                    dispatch(resetCompetitionAttemptState());
                    navigateToResult(autoSubmittedSubmitId);
                    return;
                }
                const attempt = getActiveAttempt(result, competitionId);

                // Kiểm tra có competitionSubmitId và isInProgress
                if (attempt) {
                    // Navigate trực tiếp đến trang làm bài
                    dispatch(resetCompetitionAttemptState());
                    if (isHomeworkCompetition) {
                        navigate(ROUTES.DO_HOMEWORK_COMPETITION_SUBMIT(
                            courseId,
                            lessonId,
                            learningItemId,
                            homeworkContentId,
                            attempt.competitionId,
                            attempt.competitionSubmitId
                        ));
                    } else {
                        navigate(ROUTES.DO_COMPETITION_SUBMIT(attempt.competitionId, attempt.competitionSubmitId));
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
                if (await navigateAfterStartFailure(result)) return;
                setStatus({
                    show: true,
                    type: 'error',
                    title: 'Không thể bắt đầu',
                    message: result.message || 'Đã có lỗi xảy ra'
                });
            }
        } catch (error) {
            // Error từ API hoặc network
            if (await navigateAfterStartFailure(error)) return;
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
