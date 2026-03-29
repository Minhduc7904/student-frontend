import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../core/constants';
import { AppBreadcrumb } from '../../../../shared/components';

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

    const breadcrumbItems = [
        { label: 'Cuộc thi', to: ROUTES.COMPETITION },
        { label: title ?? `Cuộc thi #${competitionId}` },
    ];

    if (currentTabLabel) {
        breadcrumbItems.push({ label: currentTabLabel });
    }

    return (
        <AppBreadcrumb items={breadcrumbItems} className="text-text-5" />
    );
};

export default CompetitionDetailBreadcrumb;
