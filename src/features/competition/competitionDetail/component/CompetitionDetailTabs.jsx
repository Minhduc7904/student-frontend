import { NavLink, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../core/constants';

const BASE_TAB = { key: 'INFO', label: 'Thông tin', path: '' };

const CompetitionDetailTabs = ({ detail }) => {
    const { competitionId } = useParams();

    const tabs = [
        BASE_TAB,
        ...(detail?.allowViewExamContent ? [{ key: 'EXAM', label: 'Đề thi', path: 'exam' }] : []),
        ...(detail?.allowLeaderboard ? [{ key: 'LEADERBOARD', label: 'Bảng xếp hạng', path: 'ranking' }] : []),
        ...(detail?.allowViewScore ? [{ key: 'HISTORY', label: 'Lịch sử làm bài', path: 'history' }] : []),
    ];

    const getTabPath = (tabPath) => {
        const base = ROUTES.COMPETITION_DETAIL(competitionId ?? '');
        return tabPath ? `${base}/${tabPath}` : base;
    };

    return (
        <div className="mt-5 w-full overflow-x-auto">
            <div className="flex min-w-max justify-start md:min-w-0">
                <div className="inline-flex items-center rounded-3xl bg-[#F1F5F9] p-1">
                    {tabs.map((tab) => {
                        return (
                            <NavLink
                                key={tab.key}
                                to={getTabPath(tab.path)}
                                end={tab.path === ''}
                                className={({ isActive }) =>
                                    `px-4 md:px-5 py-2 rounded-3xl text-text-4 font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                    isActive
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`
                                }
                            >
                                {tab.label}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CompetitionDetailTabs;