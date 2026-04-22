import {
    QuestionDetailGenericQuestionCard,
    QuestionDetailShortAnswerQuestionCard,
    QuestionDetailSingleChoiceQuestionCard,
    QuestionDetailTrueFalseQuestionCard,
} from './QuestionDetailQuestionTypeCards';

const QuestionDetailQuestionCard = ({ question, index = 0 }) => {
    const type = question?.type;

    if (type === 'SINGLE_CHOICE') {
        return <QuestionDetailSingleChoiceQuestionCard question={question} index={index} />;
    }

    if (type === 'TRUE_FALSE') {
        return <QuestionDetailTrueFalseQuestionCard question={question} index={index} />;
    }

    if (type === 'SHORT_ANSWER') {
        return <QuestionDetailShortAnswerQuestionCard question={question} index={index} />;
    }

    return <QuestionDetailGenericQuestionCard question={question} index={index} />;
};

export default QuestionDetailQuestionCard;
