import MarkdownRenderer from '../../../../../../shared/components/markdown/MarkdownRenderer';
import { getQuestionContent, getQuestionTypeLabel } from './questionUtils';
import CompetitionQuestionStatements from './CompetitionQuestionStatements';

const CompetitionQuestionCardBase = ({ question, index, statementPrefixType }) => {
    const questionContent = getQuestionContent(question);

    return (
        <article className="">
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">
                    Câu {question?.order ?? index + 1}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {getQuestionTypeLabel(question?.type)}
                </span>
                {question?.difficulty ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        {question.difficulty}
                    </span>
                ) : null}
                {question?.pointsOrigin != null ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {question.pointsOrigin} điểm
                    </span>
                ) : null}
            </div>

            {questionContent ? (
                <MarkdownRenderer
                    content={questionContent}
                    className="mt-3 text-sm text-gray-700"
                />
            ) : (
                <p className="mt-3 text-sm text-gray-500">Câu hỏi chưa có nội dung.</p>
            )}

            <CompetitionQuestionStatements
                statements={question?.statements}
                statementPrefixType={statementPrefixType}
            />
        </article>
    );
};

export default CompetitionQuestionCardBase;
