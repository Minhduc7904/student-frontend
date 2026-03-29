export const QUESTION_TYPE_LABELS = {
    SINGLE_CHOICE: 'Trắc nghiệm',
    TRUE_FALSE: 'Đúng/Sai',
    SHORT_ANSWER: 'Câu trả lời ngắn',
};

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

export const getQuestionTypeLabel = (type) => {
    if (!type) return 'UNKNOWN';
    return QUESTION_TYPE_LABELS[type] || type;
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
