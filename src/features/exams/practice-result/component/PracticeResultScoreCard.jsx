import { memo, useMemo } from 'react';
import { Card } from '../../../../shared/components';
import { formatDateTime } from '../../../../shared/utils';
import OngChucMung from '../../../../assets/images/OngChucMung.png';
import OngDongVien from '../../../../assets/images/OngDongVien.png';
import OngKhoc from '../../../../assets/images/OngKhoc.png';
import OngLike from '../../../../assets/images/OngLike.png';
import PracticeResultAnswerStatsCard from './PracticeResultAnswerStatsCard';

const TIMER_RADIUS = 56;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;
const TIMER_VISIBLE_RATIO = 0.84;
const TIMER_VISIBLE_ARC = TIMER_CIRCUMFERENCE * TIMER_VISIBLE_RATIO;

const normalizeStatus = (status) => String(status || '').trim().toUpperCase();

const toNumberOrNull = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const resolveMetric = (source, keys, fallback = '--') => {
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== '') {
            return source[key];
        }
    }

    return fallback;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toFiniteNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const toDateOrNull = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDuration = (totalSeconds) => {
    const safeSeconds = Math.max(Math.floor(Number(totalSeconds) || 0), 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    if (minutes > 0) return `${minutes} phút ${seconds} giây`;
    return `${seconds} giây`;
};

const resolveDurationLabel = (attemptDetail) => {
    const rawDuration = resolveMetric(
        attemptDetail,
        ['duration', 'durationInSeconds', 'durationSeconds', 'timeSpent', 'spentTime', 'elapsedTime', 'usedTime'],
        null
    );

    if (rawDuration != null && rawDuration !== '') {
        const numericDuration = Number(rawDuration);

        if (Number.isFinite(numericDuration)) {
            const normalizedSeconds = numericDuration > 100000 ? numericDuration / 1000 : numericDuration;
            return formatDuration(normalizedSeconds);
        }

        if (typeof rawDuration === 'string') {
            return rawDuration;
        }
    }

    const startedAtRaw = resolveMetric(attemptDetail, ['startedAt', 'createdAt'], null);
    const submittedAtRaw = resolveMetric(attemptDetail, ['submittedAt', 'endAt'], null);
    const startedAtDate = toDateOrNull(startedAtRaw);
    const submittedAtDate = toDateOrNull(submittedAtRaw);

    if (!startedAtDate || !submittedAtDate) return '--';

    const durationInSeconds = Math.max((submittedAtDate.getTime() - startedAtDate.getTime()) / 1000, 0);
    return formatDuration(durationInSeconds);
};

const getProgressColor = (progressRatio) => {
    const safeRatio = clamp(progressRatio, 0, 1);
    const startColor = { r: 239, g: 68, b: 68 };
    const endColor = { r: 22, g: 163, b: 74 };

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * safeRatio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * safeRatio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * safeRatio);

    return `rgb(${r}, ${g}, ${b})`;
};

const resolveBeeImage = (progressPercentNumber) => {
    const safePercent = clamp(Number(progressPercentNumber) || 0, 0, 100);

    if (safePercent <= 25) {
        return {
            src: OngKhoc,
            alt: 'Ong khóc',
            message: 'Đừng nản nhé, mình ôn lại phần cơ bản rồi làm lại từng bước sẽ tốt hơn nhiều.',
        };
    }

    if (safePercent <= 50) {
        return {
            src: OngDongVien,
            alt: 'Ong động viên',
            message: 'Bạn đang tiến bộ rồi đó, cố thêm một chút để vượt mốc cao hơn nhé.',
        };
    }

    if (safePercent <= 75) {
        return {
            src: OngLike,
            alt: 'Ong like',
            message: 'Làm rất ổn! Chỉnh thêm vài lỗi nhỏ là điểm sẽ bứt phá ngay.',
        };
    }

    return {
        src: OngChucMung,
        alt: 'Ong chúc mừng',
        message: 'Xuất sắc! Bạn đang có phong độ rất tốt, tiếp tục giữ vững nhé.',
    };
};

const PracticeResultScoreCard = ({ attemptDetail, questions = [] }) => {
    const normalizedStatus = normalizeStatus(attemptDetail?.status);
    const statusLabel = normalizedStatus === 'SUBMITTED' || normalizedStatus === 'SUBMITED'
        ? 'Đã nộp bài'
        : normalizedStatus || '--';

    const points = resolveMetric(attemptDetail, ['points', 'score', 'point'], '--');
    const maxPoints = resolveMetric(attemptDetail, ['maxPoints', 'totalPoints', 'maxScore'], '--');
    const totalQuestions = resolveMetric(attemptDetail, ['totalQuestions', 'questionCount'], '--');
    const totalQuestionsNumber = toFiniteNumber(totalQuestions);

    const numericPoints = toFiniteNumber(points);
    const numericMaxPoints = toFiniteNumber(maxPoints);

    const progressRatio = numericPoints != null && numericMaxPoints != null && numericMaxPoints > 0
        ? clamp(numericPoints / numericMaxPoints, 0, 1)
        : 0;
    const progressColor = getProgressColor(progressRatio);
    const progressDashLength = TIMER_VISIBLE_ARC * progressRatio;
    const progressDashArray = `${progressDashLength} ${TIMER_CIRCUMFERENCE}`;
    const trackDashArray = `${TIMER_VISIBLE_ARC} ${TIMER_CIRCUMFERENCE}`;
    const progressPercentNumber = Math.round(progressRatio * 100);
    const progressPercent = `${progressPercentNumber}%`;
    const beeImage = resolveBeeImage(progressPercentNumber);

    const correctCount = useMemo(() => {
        const directCorrect = toNumberOrNull(resolveMetric(attemptDetail, ['correctCount', 'correctAnswersCount'], null));
        if (directCorrect != null) return directCorrect;

        return questions.reduce((acc, question) => {
            return question?.answer?.isCorrect === true ? acc + 1 : acc;
        }, 0);
    }, [attemptDetail, questions]);

    const submittedAt = formatDateTime(resolveMetric(attemptDetail, ['submittedAt', 'endAt'], null)) || '--';
    const startedAt = formatDateTime(resolveMetric(attemptDetail, ['startedAt', 'createdAt'], null)) || '--';
    const durationLabel = resolveDurationLabel(attemptDetail);

    const incorrectAnswers = useMemo(() => {
        const directIncorrect = toNumberOrNull(resolveMetric(attemptDetail, ['incorrectAnswers', 'wrongAnswers', 'incorrectCount', 'wrongCount'], null));
        if (directIncorrect != null) return directIncorrect;

        return questions.reduce((acc, question) => {
            return question?.answer?.isCorrect === false ? acc + 1 : acc;
        }, 0);
    }, [attemptDetail, questions]);

    const unansweredQuestions = useMemo(() => {
        const directUnanswered = toNumberOrNull(resolveMetric(attemptDetail, ['unansweredQuestions', 'skippedQuestions', 'notAnsweredCount', 'unAnsweredCount'], null));
        if (directUnanswered != null) return directUnanswered;

        return questions.reduce((acc, question) => {
            const answer = question?.answer;
            return answer?.isCorrect == null ? acc + 1 : acc;
        }, 0);
    }, [attemptDetail, questions]);

    const normalizedTotalQuestions = totalQuestionsNumber ?? Math.max(correctCount + incorrectAnswers + unansweredQuestions, 0);

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-4 sm:p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-slate-900">Tổng quan điểm</p>
                        <p className="mt-1 text-center text-xs text-slate-500 lg:text-left">
                            {attemptDetail?.examTitle || 'Kết quả lượt làm bài của bạn'}
                        </p>

                        <div className="relative mt-4 h-40 w-40">
                            <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
                                <g style={{ transformOrigin: '50% 50%', transform: 'rotate(120deg)' }}>
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={TIMER_RADIUS}
                                        fill="none"
                                        stroke="#E2E8F0"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={trackDashArray}
                                    />
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={TIMER_RADIUS}
                                        fill="none"
                                        stroke={progressColor}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={progressDashArray}
                                        className="transition-all duration-500"
                                    />
                                </g>
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-lg font-bold text-slate-900">{points} / {maxPoints}</p>
                                <p className="text-xs font-semibold" style={{ color: progressColor }}>{progressPercent}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto flex w-full flex-1 items-center justify-center lg:mx-0 lg:shrink-0">
                        <div className="flex flex-col items-center">
                            <img
                                src={beeImage.src}
                                alt={beeImage.alt}
                                className="h-36 w-36 object-contain md:h-44 md:w-44"
                            />
                            <p className="mt-2 max-w-xs text-center text-sm font-medium text-slate-700">
                                {beeImage.message}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-stretch">
                <div className="grid w-full flex-1 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <Card className="flex-1 w-full rounded-2xl border-slate-200 p-4">
                        <p className="text-xs uppercase text-slate-500">Bắt đầu</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{startedAt}</p>
                    </Card>
                    <Card className="flex-1 w-full rounded-2xl border-slate-200 p-4">
                        <p className="text-xs uppercase text-slate-500">Thời gian nộp</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{submittedAt}</p>
                    </Card>
                    <Card className="flex-1 w-full rounded-2xl border-slate-200 p-4">
                        <p className="text-xs uppercase text-slate-500">Thời gian làm bài</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{durationLabel}</p>
                    </Card>
                </div>
                <PracticeResultAnswerStatsCard
                    correctAnswers={correctCount}
                    incorrectAnswers={incorrectAnswers}
                    unansweredQuestions={unansweredQuestions}
                    totalQuestions={normalizedTotalQuestions}
                />
            </div>
        </div>
    );
};

export default memo(PracticeResultScoreCard);