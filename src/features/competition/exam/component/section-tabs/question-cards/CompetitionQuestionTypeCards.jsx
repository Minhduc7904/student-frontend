import CompetitionQuestionCardBase from './CompetitionQuestionCardBase';

export const CompetitionSingleChoiceQuestionCard = ({ question, index }) => (
    <CompetitionQuestionCardBase
        question={question}
        index={index}
        statementPrefixType="SINGLE_CHOICE"
    />
);

export const CompetitionTrueFalseQuestionCard = ({ question, index }) => (
    <CompetitionQuestionCardBase
        question={question}
        index={index}
        statementPrefixType="TRUE_FALSE"
    />
);

export const CompetitionShortAnswerQuestionCard = ({ question, index }) => (
    <CompetitionQuestionCardBase
        question={question}
        index={index}
        statementPrefixType="SHORT_ANSWER"
    />
);

export const CompetitionGenericQuestionCard = ({ question, index }) => (
    <CompetitionQuestionCardBase
        question={question}
        index={index}
        statementPrefixType={question?.type}
    />
);
