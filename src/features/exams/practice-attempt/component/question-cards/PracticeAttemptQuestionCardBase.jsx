import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import { getQuestionContent } from './questionUtils';
import PracticeAttemptQuestionStatements from './PracticeAttemptQuestionStatements';

const PracticeAttemptQuestionCardBase = ({ question, index, statementPrefixType, children = null }) => {
    const questionContent = getQuestionContent(question);

    return (
        <article className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="text-sm">
                <span className="font-semibold text-gray-900">
                    Câu {question?.order ?? index + 1}
                </span>
            </div>

            {questionContent ? (
                <MarkdownRenderer
                    content={questionContent}
                    className="mt-3 text-sm text-gray-700"
                />
            ) : (
                <p className="mt-3 text-sm text-gray-500">Câu hỏi chưa có nội dung.</p>
            )}

            {children || (
                <PracticeAttemptQuestionStatements
                    statements={question?.statements}
                    statementPrefixType={statementPrefixType}
                />
            )}
        </article>
    );
};

export default PracticeAttemptQuestionCardBase;
