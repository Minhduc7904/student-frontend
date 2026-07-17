import { ROUTES } from '../../../core/constants';
import { competitionService } from '../../../core/services/modules/competitionService';

const RESULT_NAVIGATION_CODES = new Set([
    'ATTEMPT_ALREADY_SUBMITTED',
    'COMPETITION_ENDED',
    'MAX_ATTEMPTS_REACHED',
]);

export const getCompetitionErrorCode = (value) => (
    value?.code ??
    value?.data?.code ??
    value?.response?.data?.code ??
    value?.response?.data?.data?.code ??
    null
);

export const shouldNavigateToCompetitionResult = (value) => (
    RESULT_NAVIGATION_CODES.has(getCompetitionErrorCode(value))
);

export const getLatestSubmittedAttemptId = async (competitionId) => {
    if (!competitionId) return null;

    try {
        const response = await competitionService.getPublicStudentCompetitionHistory(competitionId, {
            page: 1,
            limit: 1,
            sortBy: 'submittedAt',
            sortOrder: 'desc',
        });
        const payload = response?.data?.data ?? response?.data ?? response;
        const history = Array.isArray(payload) ? payload : payload?.history ?? payload?.items ?? [];
        const attempt = history[0];
        return attempt?.competitionSubmitId ?? attempt?.submitId ?? null;
    } catch {
        return null;
    }
};

export const navigateToCompetitionResult = ({
    navigate,
    isHomeworkCompetition,
    courseId,
    lessonId,
    learningItemId,
    competitionId,
    submitId,
    replace = true,
}) => {
    if (isHomeworkCompetition) {
        const route = submitId
            ? ROUTES.COURSE_LEARNING_ITEM_RESULT(courseId, lessonId, learningItemId, submitId)
            : ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItemId);
        navigate(route, { replace, state: { resetAll: true } });
        return;
    }

    const route = submitId
        ? ROUTES.COMPETITION_RESULT(competitionId, submitId)
        : `${ROUTES.COMPETITION_DETAIL(competitionId)}/history`;
    navigate(route, { replace });
};
