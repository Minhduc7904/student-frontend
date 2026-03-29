import MarkdownRenderer from '../../../../../shared/components/markdown/MarkdownRenderer';
import { getStatementContent, getStatementPrefix } from './questionUtils';

const PracticeAttemptQuestionStatements = ({ statements = [], statementPrefixType }) => {
    const safeStatements = Array.isArray(statements) ? statements : [];
    if (!safeStatements.length) return null;

    return (
        <div className="mt-4 space-y-3">
            {safeStatements.map((statement, statementIndex) => {
                const statementContent = getStatementContent(statement);
                const statementPrefix = getStatementPrefix(statementPrefixType, statementIndex);

                return (
                    <div
                        key={statement?.statementId ?? `practice-statement-${statementIndex + 1}`}
                        className="flex items-start gap-2"
                    >
                        <span className="mt-0.5 shrink-0 text-sm font-semibold text-gray-900">
                            {statementPrefix}
                        </span>
                        {statementContent ? (
                            <MarkdownRenderer
                                content={statementContent}
                                className="min-w-0 flex-1 text-sm text-gray-700"
                            />
                        ) : (
                            <p className="text-sm text-gray-500">Không có nội dung mệnh đề.</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PracticeAttemptQuestionStatements;
