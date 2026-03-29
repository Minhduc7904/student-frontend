import {
    CompetitionGenericQuestionCard,
    CompetitionShortAnswerQuestionCard,
    CompetitionSingleChoiceQuestionCard,
    CompetitionTrueFalseQuestionCard,
} from './CompetitionQuestionTypeCards';

const CompetitionQuestionCard = ({ question, index }) => {
    const type = question?.type;

    if (type === 'SINGLE_CHOICE') {
        return <CompetitionSingleChoiceQuestionCard question={question} index={index} />;
    }

    if (type === 'TRUE_FALSE') {
        return <CompetitionTrueFalseQuestionCard question={question} index={index} />;
    }

    if (type === 'SHORT_ANSWER') {
        return <CompetitionShortAnswerQuestionCard question={question} index={index} />;
    }

    return <CompetitionGenericQuestionCard question={question} index={index} />;
};

export default CompetitionQuestionCard;
