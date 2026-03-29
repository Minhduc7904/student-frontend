import CompetitionQuestionCard from './question-cards/CompetitionQuestionCard';

const CompetitionExamQuestionList = ({ questions = [] }) => {
    return (
        <div className="mt-5 space-y-4">
            {(questions || []).map((question, index) => (
                <CompetitionQuestionCard
                    key={question?.questionId ?? `question-${index + 1}`}
                    question={question}
                    index={index}
                />
            ))}
        </div>
    );
};

export default CompetitionExamQuestionList;
