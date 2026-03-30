export const getQuestionContent = (question) => {
    if (question?.processedContent) return question.processedContent;
    if (question?.content) return question.content;
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

export const resolveSelectedStatementId = (question) => {
    if (question?.answer?.statementId != null) return question.answer.statementId;

    const selectedStatementIds = Array.isArray(question?.answer?.selectedStatementIds)
        ? question.answer.selectedStatementIds
        : [];
    if (selectedStatementIds.length > 0) return selectedStatementIds[0];

    return null;
};

export const resolveTrueFalseMap = (question) => {
    const map = new Map();
    const trueFalseAnswers = Array.isArray(question?.answer?.trueFalseAnswers)
        ? question.answer.trueFalseAnswers
        : [];

    trueFalseAnswers.forEach((item) => {
        if (item?.statementId != null && typeof item?.isTrue === 'boolean') {
            map.set(String(item.statementId), item.isTrue);
        }
    });

    const rawAnswer = question?.answer?.answer;
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
    return question?.answer?.answerText ?? question?.answer?.answer ?? '';
};