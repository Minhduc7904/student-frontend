import { memo, useMemo } from 'react';
import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import PracticeResultQuestionCardBase from './PracticeResultQuestionCardBase';
import PracticeResultQuestionStatements from './PracticeResultQuestionStatements';
import {
    getSortedStatements,
    getStatementContent,
    getStatementPrefix,
    resolveSelectedStatementId,
    resolveShortAnswer,
    resolveTrueFalseMap,
} from './questionUtils';

const StatementContent = memo(({ statement }) => {
    const content = getStatementContent(statement);

    if (!content) {
        return <p className="text-sm text-gray-500">Không có nội dung mệnh đề.</p>;
    }

    return (
        <MarkdownRenderer
            content={content}
            className="min-w-0 flex-1 text-sm text-gray-700"
        />
    );
});

export const PracticeResultSingleChoiceQuestionCard = ({ question, index }) => {
    const statements = useMemo(() => getSortedStatements(question), [question]);
    const selectedStatementId = resolveSelectedStatementId(question);

    return (
        <PracticeResultQuestionCardBase question={question} index={index}>
            <div className="mt-3 space-y-2.5" role="list" aria-label={`single-choice-result-${question?.questionId ?? index}`}>
                {statements.map((statement, statementIndex) => {
                    const statementId = statement?.statementId;
                    const isSelected = String(selectedStatementId) === String(statementId);
                    const isCorrect = statement?.isCorrect === true;
                    const statementPrefix = getStatementPrefix('SINGLE_CHOICE', statementIndex);

                    const optionClassName = isSelected && isCorrect
                        ? 'border-emerald-400 bg-emerald-50'
                        : isSelected
                            ? 'border-rose-400 bg-rose-50'
                            : isCorrect
                                ? 'border-emerald-200 bg-emerald-50/60'
                                : 'border-slate-200 bg-white';

                    const indicatorClassName = isSelected && isCorrect
                        ? 'border-emerald-600 bg-emerald-600'
                        : isSelected
                            ? 'border-rose-600 bg-rose-600'
                            : isCorrect
                                ? 'border-emerald-500 bg-emerald-100'
                                : 'border-slate-300 bg-white';

                    return (
                        <div
                            key={statementId ?? `single-choice-result-${statementIndex + 1}`}
                            className={`w-full rounded-xl border px-3 py-2 text-left ${optionClassName}`}
                        >
                            <div className="flex items-start gap-2">
                                <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border ${indicatorClassName}`} />
                                <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                                    {statementPrefix}
                                </span>
                                <StatementContent statement={statement} />
                                <div className="ml-auto flex shrink-0 items-center gap-1.5">
                                    {isSelected ? (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            Bạn chọn
                                        </span>
                                    ) : null}
                                    {isCorrect ? (
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                            Đáp án đúng
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PracticeResultQuestionCardBase>
    );
};

export const PracticeResultTrueFalseQuestionCard = ({ question, index }) => {
    const statements = useMemo(() => getSortedStatements(question), [question]);
    const answerMap = useMemo(() => resolveTrueFalseMap(question), [question]);

    return (
        <PracticeResultQuestionCardBase question={question} index={index}>
            <div className="mt-3 space-y-2.5">
                {statements.map((statement, statementIndex) => {
                    const statementId = statement?.statementId;
                    const statementPrefix = getStatementPrefix('TRUE_FALSE', statementIndex);

                    const statementKey = String(statementId);
                    const hasAnswered = answerMap.has(statementKey);
                    const currentValue = hasAnswered ? answerMap.get(statementKey) : null;
                    const statementCorrect = typeof statement?.isCorrect === 'boolean' ? statement.isCorrect : null;
                    const isAnsweredCorrect = hasAnswered && statementCorrect != null && currentValue === statementCorrect;
                    const isAnsweredWrong = hasAnswered && statementCorrect != null && currentValue !== statementCorrect;

                    const isTrueSelected = currentValue === true;
                    const isFalseSelected = currentValue === false;

                    const rowClassName = isAnsweredCorrect
                        ? 'border-emerald-300 bg-emerald-50'
                        : isAnsweredWrong
                            ? 'border-rose-300 bg-rose-50'
                            : hasAnswered
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-slate-200 bg-white';

                    return (
                        <div
                            key={statementId ?? `true-false-result-${statementIndex + 1}`}
                            className={`rounded-xl border px-3 py-2 ${rowClassName}`}
                        >
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 shrink-0 flex items-center gap-2">
                                    <span
                                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${isTrueSelected
                                            ? 'border-emerald-600 bg-emerald-600 text-white'
                                            : 'border-emerald-300 bg-white text-emerald-700'
                                            }`}
                                    >
                                        Đúng
                                    </span>
                                    <span
                                        className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${isFalseSelected
                                            ? 'border-rose-600 bg-rose-600 text-white'
                                            : 'border-rose-300 bg-white text-rose-700'
                                            }`}
                                    >
                                        Sai
                                    </span>
                                </div>

                                <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                                    {statementPrefix}
                                </span>

                                <StatementContent statement={statement} />
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-18.5">
                                {hasAnswered ? (
                                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${isAnsweredWrong ? 'border-rose-300 bg-rose-100 text-rose-700' : isAnsweredCorrect ? 'border-emerald-300 bg-emerald-100 text-emerald-700' : 'border-blue-300 bg-blue-100 text-blue-700'}`}>
                                        Bạn chọn: {currentValue ? 'Đúng' : 'Sai'}
                                    </span>
                                ) : (
                                    <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                        Bạn chưa chọn
                                    </span>
                                )}

                                {statementCorrect != null ? (
                                    <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                        Đáp án đúng: {statementCorrect ? 'Đúng' : 'Sai'}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </PracticeResultQuestionCardBase>
    );
};

export const PracticeResultShortAnswerQuestionCard = ({ question, index }) => {
    const shortAnswer = String(resolveShortAnswer(question) || '').trim();
    const answer = question?.answer;
    const isAnswered = Boolean(answer) && shortAnswer.length > 0;
    const isCorrect = answer?.isCorrect;
    const shouldShowCorrectAnswer = Boolean(question?.correctAnswer) && (!isAnswered || isCorrect === false);

    const answerInputClassName = isCorrect === true
        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
        : isCorrect === false
            ? 'border-rose-300 bg-rose-50 text-rose-800'
            : 'border-slate-200 bg-white text-slate-800';

    return (
        <PracticeResultQuestionCardBase question={question} index={index}>
            <div className="mt-3 space-y-2">
                <div className={`rounded-xl border px-3 py-2 ${answerInputClassName}`}>
                    {isAnswered ? (
                        <p className="text-sm font-medium">{shortAnswer}</p>
                    ) : (
                        <p className="text-sm text-slate-600">Bạn chưa điền câu trả lời.</p>
                    )}
                </div>

                {shouldShowCorrectAnswer ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                        <p className="text-xs font-semibold text-emerald-700">Đáp án đúng</p>
                        <p className="mt-1 text-sm font-medium text-emerald-800">{String(question.correctAnswer)}</p>
                    </div>
                ) : null}
            </div>
        </PracticeResultQuestionCardBase>
    );
};

export const PracticeResultGenericQuestionCard = ({ question, index }) => {
    return (
        <PracticeResultQuestionCardBase question={question} index={index}>
            <PracticeResultQuestionStatements
                statements={question?.statements}
                statementPrefixType={question?.type}
            />

            {question?.answer?.answerText || question?.answer?.answer ? (
                <p className="mt-2 text-sm text-slate-700">
                    Trả lời: {String(question?.answer?.answerText ?? question?.answer?.answer)}
                </p>
            ) : null}
        </PracticeResultQuestionCardBase>
    );
};