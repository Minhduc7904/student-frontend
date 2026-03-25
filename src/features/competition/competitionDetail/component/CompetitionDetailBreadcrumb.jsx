import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../core/constants';

const CompetitionDetailBreadcrumb = ({ title, competitionId }) => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentTabSegment = pathSegments[2] ?? '';

    const tabLabelBySegment = {
        exam: 'Đề thi',
        ranking: 'Bảng xếp hạng',
        history: 'Lịch sử làm bài',
        result: 'Kết quả',
    };

    const currentTabLabel = tabLabelBySegment[currentTabSegment] ?? '';

    return (
        <div className="mb-4 flex items-center gap-2 text-text-5 text-gray-600">
            <Link to={ROUTES.COMPETITION} className="hover:underline">
                Cuộc thi
            </Link>
            <ChevronRight size={16} />
            <span className="truncate text-gray-900">{title ?? `Cuộc thi #${competitionId}`}</span>
            {currentTabLabel && (
                <>
                    <ChevronRight size={16} />
                    <span className="truncate text-gray-700">{currentTabLabel}</span>
                </>
            )}
        </div>
    );
};

export default CompetitionDetailBreadcrumb;
