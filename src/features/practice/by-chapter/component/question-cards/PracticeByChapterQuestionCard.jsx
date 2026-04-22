import {
    PracticeByChapterGenericQuestionCard,
    PracticeByChapterShortAnswerQuestionCard,
    PracticeByChapterSingleChoiceQuestionCard,
    PracticeByChapterTrueFalseQuestionCard,
} from './PracticeByChapterQuestionTypeCards';

const PracticeByChapterQuestionCard = ({ question, index }) => {
    const type = question?.type;
    if (type === 'SINGLE_CHOICE') {
        return <PracticeByChapterSingleChoiceQuestionCard question={question} index={index} />;
    }

    if (type === 'TRUE_FALSE') {
        return <PracticeByChapterTrueFalseQuestionCard question={question} index={index} />;
    }

    if (type === 'SHORT_ANSWER') {
        return <PracticeByChapterShortAnswerQuestionCard question={question} index={index} />;
    }

    return <PracticeByChapterGenericQuestionCard question={question} index={index} />;
};

export default PracticeByChapterQuestionCard;
