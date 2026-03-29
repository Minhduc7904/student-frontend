import { memo } from 'react';
import PracticeAttemptQuestionCard from './question-cards/PracticeAttemptQuestionCard';

const PracticeAttemptQuestionList = ({
    questions = [],
    attemptId = null,
    sectionIdentity = null,
    onQuestionInteraction,
    onSubmitQuestionAnswer,
}) => {
    const safeQuestions = Array.isArray(questions) ? questions : [];

    if (!safeQuestions.length) {
        return (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Phần này chưa có câu hỏi.
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-4">
            {safeQuestions.map((question, index) => {
                const questionKey = question?.questionId ?? `practice-question-${index + 1}`;
                const questionAnchorId = question?.questionId != null ? `practice-question-${question.questionId}` : null;

                return (
                    <div
                        key={questionKey}
                        id={questionAnchorId || undefined}
                        data-practice-question-id={question?.questionId ?? undefined}
                        data-practice-section-id={sectionIdentity || undefined}
                    >
                        <PracticeAttemptQuestionCard
                            question={question}
                            index={index}
                            attemptId={attemptId}
                            onQuestionInteraction={onQuestionInteraction}
                            onSubmitQuestionAnswer={onSubmitQuestionAnswer}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default memo(PracticeAttemptQuestionList);
