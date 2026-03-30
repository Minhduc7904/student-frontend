import { memo } from 'react';
import PracticeResultAnswersCard from './PracticeResultAnswersCard';
import PracticeResultScoreCard from './PracticeResultScoreCard';

const PracticeResultSummaryCard = ({ attemptDetail, questions = [] }) => {
    return (
        <div className="space-y-4">
            <PracticeResultScoreCard
                attemptDetail={attemptDetail}
                questions={questions}
            />

            <PracticeResultAnswersCard questions={questions} />
        </div>
    );
};

export default memo(PracticeResultSummaryCard);
