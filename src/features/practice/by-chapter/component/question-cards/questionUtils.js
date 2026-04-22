export const getQuestionContent = (question) => {
    if (question?.processedContent) return question.processedContent;
    if (question?.content) return question.content;
    if (question?.questionContent) return question.questionContent;
    return '';
};

export const getStatementContent = (statement) => {
    if (statement?.processedContent) return statement.processedContent;
    if (statement?.content) return statement.content;
    return '';
};

const getAlphabeticLabel = (position, isUpperCase) => {
    const safePosition = Number(position);
    if (!Number.isFinite(safePosition) || safePosition < 1 || safePosition > 26) {
        return null;
    }

    const baseCode = isUpperCase ? 65 : 97;
    return `${String.fromCharCode(baseCode + safePosition - 1)})`;
};

export const getStatementPrefix = (questionType, statementIndex) => {
    const position = statementIndex + 1;

    if (questionType === 'SINGLE_CHOICE') {
        return getAlphabeticLabel(position, true) || `${position})`;
    }

    if (questionType === 'TRUE_FALSE') {
        return getAlphabeticLabel(position, false) || `${position})`;
    }

    return `Mệnh đề ${position}`;
};

export const getSortedStatements = (question) => {
    const statements = Array.isArray(question?.statements) ? question.statements : [];

    return [...statements].sort((a, b) => {
        const aOrder = Number.isFinite(Number(a?.order)) ? Number(a.order) : Number.MAX_SAFE_INTEGER;
        const bOrder = Number.isFinite(Number(b?.order)) ? Number(b.order) : Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
    });
};

const toTimestamp = (value) => {
    if (!value) return 0;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
};

const resolveLatestStudentQuestionAnswer = (question) => {
    const answers = Array.isArray(question?.studentQuestionAnswers)
        ? question.studentQuestionAnswers.filter(Boolean)
        : [];

    if (!answers.length) return null;

    return [...answers].sort((a, b) => {
        const aTime = toTimestamp(a?.updatedAt) || toTimestamp(a?.createdAt) || toTimestamp(a?.submittedAt);
        const bTime = toTimestamp(b?.updatedAt) || toTimestamp(b?.createdAt) || toTimestamp(b?.submittedAt);

        if (aTime !== bTime) return bTime - aTime;

        const aId = Number(a?.questionAnswerId ?? a?.id ?? 0);
        const bId = Number(b?.questionAnswerId ?? b?.id ?? 0);
        return bId - aId;
    })[0] || null;
};

export const resolveCurrentAnswer = (question) => {
    return resolveLatestStudentQuestionAnswer(question) || question?.answer || null;
};

export const resolveQuestionAnswerId = (question) => {
    const answer = resolveCurrentAnswer(question);
    return answer?.questionAnswerId ?? answer?.id ?? null;
};

export const resolveSelectedStatementId = (question) => {
    const answer = resolveCurrentAnswer(question);
    if (answer?.statementId != null) return answer.statementId;

    const selectedStatementIds = Array.isArray(answer?.selectedStatementIds)
        ? answer.selectedStatementIds
        : [];
    if (selectedStatementIds.length > 0) return selectedStatementIds[0];

    return null;
};

export const resolveTrueFalseMap = (question) => {
    const answer = resolveCurrentAnswer(question);
    const map = new Map();
    const trueFalseAnswers = Array.isArray(answer?.trueFalseAnswers)
        ? answer.trueFalseAnswers
        : [];

    trueFalseAnswers.forEach((item) => {
        if (item?.statementId != null && typeof item?.isTrue === 'boolean') {
            map.set(String(item.statementId), item.isTrue);
        }
    });

    const rawAnswer = answer?.answer;
    if (typeof rawAnswer === 'string' && rawAnswer.trim()) {
        try {
            const parsed = JSON.parse(rawAnswer);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                Object.entries(parsed).forEach(([statementId, isTrue]) => {
                    if (typeof isTrue === 'boolean') {
                        map.set(String(statementId), isTrue);
                    }
                });
            }
        } catch {
            // Ignore malformed JSON and fallback to trueFalseAnswers.
        }
    }

    return map;
};

export const resolveShortAnswer = (question) => {
    const answer = resolveCurrentAnswer(question);
    return answer?.answerText ?? answer?.answer ?? '';
};
