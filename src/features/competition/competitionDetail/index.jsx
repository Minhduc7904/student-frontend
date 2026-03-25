import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { ContentLoading } from '../../../shared/components';
import CompetitionDetailBreadcrumb from './component/CompetitionDetailBreadcrumb';
import CompetitionDetailContent from './component/CompetitionDetailContent';
import {
    clearCompetitionDetail,
    fetchCompetitionDetail,
    selectCompetitionDetail,
    selectCompetitionDetailError,
    selectCompetitionDetailLoading,
} from './store';

const CompetitionDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { competitionId } = useParams();
    const detail = useSelector(selectCompetitionDetail);
    const loading = useSelector(selectCompetitionDetailLoading);
    const error = useSelector(selectCompetitionDetailError);

    useEffect(() => {
        if (!competitionId) {
            dispatch(clearCompetitionDetail());
            return;
        }

        dispatch(fetchCompetitionDetail(competitionId));

        return () => {
            dispatch(clearCompetitionDetail());
        };
    }, [dispatch, competitionId]);

    const handleCountdownFinished = useCallback(() => {
        if (!competitionId) return;
        dispatch(fetchCompetitionDetail(competitionId));
    }, [dispatch, competitionId]);

    const normalizedError =
        !error
            ? ''
            : typeof error === 'string'
                ? error
                : error?.message || 'Không thể tải chi tiết cuộc thi.';

    if (!competitionId) {
        return (
            <div className="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                Thiếu mã cuộc thi.
            </div>
        );
    }

    if (loading) {
        return <ContentLoading message="Đang tải chi tiết cuộc thi..." height="py-12" />;
    }

    if (normalizedError) {
        return (
            <div className="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                {normalizedError}
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="w-full rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-gray-600 text-text-4">
                Không có dữ liệu chi tiết cuộc thi.
            </div>
        );
    }

    return (
        <section className="w-full max-w-5xl py-4 md:py-6">
            <div className="mb-3 md:hidden">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.COMPETITION)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
                >
                    <ArrowLeft size={16} />
                    Quay lại danh sách cuộc thi
                </button>
            </div>
            <div className="hidden md:block">
                <CompetitionDetailBreadcrumb title={detail?.title} competitionId={competitionId} />
            </div>
            <CompetitionDetailContent
                detail={detail}
                competitionId={competitionId}
                onCountdownFinished={handleCountdownFinished}
            />
        </section>
    );
};

export default CompetitionDetailPage;
