import { memo } from 'react';
import CompetitionExamSectionTabs from '../../../competition/exam/component/CompetitionExamSectionTabs';

const ExamQuestionsTabContent = ({ examContentError, sectionsWithQuestions, examContentLoading }) => {
    if (examContentError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {typeof examContentError === 'string'
                    ? examContentError
                    : examContentError?.message || 'Không thể tải nội dung câu hỏi.'}
            </div>
        );
    }

    return (
        <CompetitionExamSectionTabs
            sectionsWithQuestions={sectionsWithQuestions}
            loading={examContentLoading}
        />
    );
};

export default memo(ExamQuestionsTabContent);
