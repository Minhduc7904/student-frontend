import {
    PracticeAttemptGenericQuestionCard,
    PracticeAttemptShortAnswerQuestionCard,
    PracticeAttemptSingleChoiceQuestionCard,
    PracticeAttemptTrueFalseQuestionCard,
} from './PracticeAttemptQuestionTypeCards';

const PracticeAttemptQuestionCard = ({
    question,
    index,
    attemptId = null,
    onQuestionInteraction,
    onSubmitQuestionAnswer,
}) => {
    const type = question?.type;

    if (type === 'SINGLE_CHOICE') {
        return (
            <PracticeAttemptSingleChoiceQuestionCard
                question={question}
                index={index}
                attemptId={attemptId}
                onQuestionInteraction={onQuestionInteraction}
                onSubmitQuestionAnswer={onSubmitQuestionAnswer}
            />
        );
    }

    if (type === 'TRUE_FALSE') {
        return (
            <PracticeAttemptTrueFalseQuestionCard
                question={question}
                index={index}
                attemptId={attemptId}
                onQuestionInteraction={onQuestionInteraction}
                onSubmitQuestionAnswer={onSubmitQuestionAnswer}
            />
        );
    }

    if (type === 'SHORT_ANSWER') {
        return (
            <PracticeAttemptShortAnswerQuestionCard
                question={question}
                index={index}
                attemptId={attemptId}
                onQuestionInteraction={onQuestionInteraction}
                onSubmitQuestionAnswer={onSubmitQuestionAnswer}
            />
        );
    }

    return (
        <PracticeAttemptGenericQuestionCard
            question={question}
            index={index}
            attemptId={attemptId}
            onQuestionInteraction={onQuestionInteraction}
            onSubmitQuestionAnswer={onSubmitQuestionAnswer}
        />
    );
};

export default PracticeAttemptQuestionCard;
