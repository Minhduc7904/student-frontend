import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Logo } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import { Home, LayoutList, Send } from 'lucide-react';

/**
 * CompetitionHeader
 * Fixed header cho trang làm bài thi
 * - Trái: Logo (icon nhỏ dạng collapsed)
 * - Giữa: Title và subtitle của competition
 * - Phải: Nút nộp bài + Nút quay về
 */
export const CompetitionHeader = memo(({ competition, loading, onToggleSidebar, onGoBack, onSubmit, submitLoading = false, backLabel = 'Trang chủ' }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        if (onGoBack) {
            onGoBack();
        } else {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            {/* Mobile: 2-row layout */}
            <div className="flex flex-col md:hidden">
                {/* Row 1: Logo + buttons */}
                <div className="flex items-center justify-between h-12 px-4">
                    <div className="shrink-0">
                        <Logo
                            mode="default"
                            containerClassName="flex items-center"
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSubmit}
                            disabled={submitLoading}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-text-5 font-semibold transition-colors disabled:opacity-50"
                            title="Nộp bài"
                        >
                            <Send className="w-3.5 h-3.5 shrink-0" />
                            <span>{submitLoading ? 'Nộp...' : 'Nộp bài'}</span>
                        </button>
                        <button
                            onClick={onToggleSidebar}
                            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Danh sách câu hỏi"
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
                            title="Quay về"
                        >
                            <Home className="w-4 h-4 shrink-0" />
                        </button>
                    </div>
                </div>

                {/* Row 2: Competition title */}
                {!loading && competition && (
                    <div className="flex flex-col items-center justify-center h-8 px-4 min-w-0">
                        <h1 className="text-text-5 font-bold text-gray-900 truncate w-full text-center leading-tight">
                            {competition.title}
                        </h1>
                        {competition.subtitle && (
                            <p className="text-[10px] text-gray-500 truncate w-full text-center leading-tight">
                                {competition.subtitle}
                            </p>
                        )}
                    </div>
                )}
                {loading && (
                    <div className="flex flex-col items-center gap-1 h-8 justify-center px-4">
                        <div className="h-3.5 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                )}
            </div>

            {/* Desktop: single-row layout (md+) */}
            <div className="hidden md:flex items-center justify-between h-16 lg:h-17 px-6 lg:px-8">
                {/* Left - Logo */}
                <div className="shrink-0">
                    <Logo
                        mode="default"
                        containerClassName="flex items-center"
                        className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                    />
                </div>

                {/* Center - Competition title & subtitle */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 min-w-0">
                    {loading ? (
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                        </div>
                    ) : competition ? (
                        <>
                            <h1 className="text-text-3 font-bold text-gray-900 truncate max-w-100 lg:max-w-150 leading-tight">
                                {competition.title}
                            </h1>
                            {competition.subtitle && (
                                <p className="text-text-5 text-gray-500 truncate max-w-100 lg:max-w-150 leading-tight">
                                    {competition.subtitle}
                                </p>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Right - Submit + Back buttons */}
                <div className="shrink-0 flex items-center gap-3">
                    <button
                        onClick={onSubmit}
                        disabled={submitLoading}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white transition-colors disabled:opacity-50"
                        title="Nộp bài"
                    >
                        <Send className="w-4 h-4 shrink-0" />
                        <span className="text-text-4 font-semibold">{submitLoading ? 'Đang nộp...' : 'Nộp bài'}</span>
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
                        title={backLabel}
                    >
                        <Home className="w-5 h-5 shrink-0" />
                        <span className="text-text-4 font-medium">{backLabel}</span>
                    </button>
                </div>
            </div>
        </header>
    );
});

CompetitionHeader.propTypes = {
    competition: PropTypes.shape({
        competitionId: PropTypes.number,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        durationMinutes: PropTypes.number,
        allowLeaderboard: PropTypes.bool,
        allowViewScore: PropTypes.bool,
        allowViewAnswer: PropTypes.bool,
        enableAntiCheating: PropTypes.bool,
    }),
    loading: PropTypes.bool,
    onToggleSidebar: PropTypes.func,
    onGoBack: PropTypes.func,
    onSubmit: PropTypes.func,
    submitLoading: PropTypes.bool,
    backLabel: PropTypes.string,
};

CompetitionHeader.displayName = 'CompetitionHeader';

export default CompetitionHeader;
