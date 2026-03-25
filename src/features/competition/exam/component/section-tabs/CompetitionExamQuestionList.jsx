import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';

const QUESTION_TYPE_LABELS = {
    SINGLE_CHOICE: 'Trắc nghiệm',
    TRUE_FALSE: 'Đúng/Sai',
    SHORT_ANSWER: 'Câu trả lời ngắn',
};

const getQuestionContent = (question) => {
    if (question?.processedContent) return question.processedContent;
    if (question?.content) return question.content;
    return '';
};

const getStatementContent = (statement) => {
    if (statement?.processedContent) return statement.processedContent;
    if (statement?.content) return statement.content;
    return '';
};

const getQuestionTypeLabel = (type) => {
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

const getStatementPrefix = (questionType, statement, index) => {
    const position = index + 1;

    if (questionType === 'SINGLE_CHOICE') {
        return getAlphabeticLabel(position, true) || `${position})`;
    }

    if (questionType === 'TRUE_FALSE') {
        return getAlphabeticLabel(position, false) || `${position})`;
    }

    return `Mệnh đề ${position}`;
};

const CompetitionExamQuestionList = ({ questions = [] }) => {
    return (
        <div className="mt-5 space-y-4">
            {(questions || []).map((question, index) => {
                const questionContent = getQuestionContent(question);
                const statements = Array.isArray(question?.statements) ? question.statements : [];

                return (
                    <article
                        key={question?.questionId ?? `question-${index + 1}`}
                        className=""
                    >
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-900">
                                Câu {question?.order ?? index + 1}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                {getQuestionTypeLabel(question?.type)}
                            </span>
                            {question?.difficulty ? (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    {question.difficulty}
                                </span>
                            ) : null}
                            {question?.pointsOrigin != null ? (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    {question.pointsOrigin} điểm
                                </span>
                            ) : null}
                        </div>

                        {questionContent ? (
                            <MarkdownRenderer
                                content={questionContent}
                                className="mt-3 text-sm text-gray-700"
                            />
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">Câu hỏi chưa có nội dung.</p>
                        )}

                        {statements.length ? (
                            <div className="mt-4 space-y-3">
                                {statements.map((statement, statementIndex) => {
                                    const statementContent = getStatementContent(statement);
                                    const statementPrefix = getStatementPrefix(
                                        question?.type,
                                        statement,
                                        statementIndex
                                    );
                                    const composedStatementContent = statementContent
                                        ? `${statementPrefix} ${statementContent}`
                                        : `${statementPrefix} Không có nội dung mệnh đề.`;

                                    return (
                                        <div
                                            key={statement?.statementId ?? `statement-${statementIndex + 1}`}
                                            className=""
                                        >
                                            <MarkdownRenderer
                                                content={composedStatementContent}
                                                className="mt-2 text-sm text-gray-700"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </article>
                );
            })}
        </div>
    );
};

export default CompetitionExamQuestionList;
