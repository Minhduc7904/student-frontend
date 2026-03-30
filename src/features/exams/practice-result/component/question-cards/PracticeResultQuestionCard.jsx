import {
    PracticeResultGenericQuestionCard,
    PracticeResultShortAnswerQuestionCard,
    PracticeResultSingleChoiceQuestionCard,
    PracticeResultTrueFalseQuestionCard,
} from './PracticeResultQuestionTypeCards';

const PracticeResultQuestionCard = ({ question, index }) => {
    const type = question?.type;

    if (type === 'SINGLE_CHOICE') {
        return <PracticeResultSingleChoiceQuestionCard question={question} index={index} />;
    }

    if (type === 'TRUE_FALSE') {
        return <PracticeResultTrueFalseQuestionCard question={question} index={index} />;
    }

    if (type === 'SHORT_ANSWER') {
        return <PracticeResultShortAnswerQuestionCard question={question} index={index} />;
    }

    return <PracticeResultGenericQuestionCard question={question} index={index} />;
};

export default PracticeResultQuestionCard;