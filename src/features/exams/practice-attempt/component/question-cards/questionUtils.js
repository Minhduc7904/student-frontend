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
