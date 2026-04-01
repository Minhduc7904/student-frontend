import { Flag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import {
    selectIsPracticeQuestionBookmarked,
    togglePracticeBookmarkedQuestion,
} from '../../store/practiceAttemptSlice';
import { getQuestionContent } from './questionUtils';
import PracticeAttemptQuestionStatements from './PracticeAttemptQuestionStatements';

const PracticeAttemptQuestionCardBase = ({ question, index, statementPrefixType, children = null }) => {
    const dispatch = useDispatch();
    const questionId = question?.questionId;
    const isBookmarked = useSelector((state) => selectIsPracticeQuestionBookmarked(state, questionId));
    const questionContent = getQuestionContent(question);

    const handleToggleBookmark = () => {
        if (questionId == null) return;
        dispatch(togglePracticeBookmarkedQuestion(questionId));
    };

    return (
        <article className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
                <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                        Câu {question?.order ?? index + 1}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleToggleBookmark}
                    disabled={questionId == null}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors ${isBookmarked
                            ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        } ${questionId == null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                    <Flag size={12} className={isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'} />
                    {isBookmarked ? 'Đã lưu' : 'Lưu câu hỏi'}
                </button>
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
