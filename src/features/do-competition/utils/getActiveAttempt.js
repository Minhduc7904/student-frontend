export const getActiveAttempt = (payload, fallbackCompetitionId) => {
    const data = payload?.data ?? payload ?? {};
    const attempt = data.attempt ?? data.competitionSubmit ?? data;
    const competitionSubmitId = attempt.competitionSubmitId ?? attempt.submitId ?? data.competitionSubmitId ?? data.submitId;
    const status = attempt.status ?? attempt.attemptStatus ?? data.status ?? data.attemptStatus;
    const isInProgress = attempt.isInProgress ?? data.isInProgress ?? status === 'IN_PROGRESS';

    if (!competitionSubmitId || !isInProgress) return null;

    return {
        competitionId: attempt.competitionId ?? data.competitionId ?? fallbackCompetitionId,
        competitionSubmitId,
    };
};
