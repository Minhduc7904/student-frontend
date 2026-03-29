import { memo } from 'react';

const ExamDiscussionTabContent = () => {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Khu vực thảo luận sẽ sớm được cập nhật. Bạn có thể quay lại sau để xem các trao đổi về đề thi này.
        </div>
    );
};

export default memo(ExamDiscussionTabContent);
