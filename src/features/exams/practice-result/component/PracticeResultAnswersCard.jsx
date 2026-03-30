import { memo } from 'react';
import { Card } from '../../../../shared/components';
import PracticeResultQuestionCard from './question-cards/PracticeResultQuestionCard';

const PracticeResultAnswersCard = ({ questions = [] }) => {
    return (
        <Card className="rounded-2xl border-slate-200 p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-base font-semibold text-slate-900">Chi tiết câu trả lời</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {questions.length} câu
                </span>
            </div>

            {questions.length === 0 ? (
                <p className="text-sm text-slate-600">Không có dữ liệu câu trả lời cho lượt làm bài này.</p>
            ) : (
                <div className="space-y-2.5">
                    {questions.map((question, index) => {
                        return (
                            <PracticeResultQuestionCard
                                key={String(question?.questionId || index)}
                                question={question}
                                index={index}
                            />
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default memo(PracticeResultAnswersCard);