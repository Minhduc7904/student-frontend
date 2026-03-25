import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    clearCompetitionExam,
    fetchCompetitionExam,
    selectCompetitionExamError,
    selectCompetitionExamInfo,
    selectCompetitionExamLoading,
    selectCompetitionExamSectionsWithQuestions,
    selectCompetitionExamTotalQuestions,
} from './store';
import CompetitionExamDetailInfo from './component/CompetitionExamDetailInfo';
import CompetitionExamSectionTabs from './component/CompetitionExamSectionTabs';

const CompetitionExamPage = ({ competitionId: competitionIdProp }) => {
    const dispatch = useDispatch();
    const { competitionId: competitionIdFromParams } = useParams();
    const competitionId = competitionIdProp ?? competitionIdFromParams;
    const examInfo = useSelector(selectCompetitionExamInfo);
    const sectionsWithQuestions = useSelector(selectCompetitionExamSectionsWithQuestions);
    const totalQuestions = useSelector(selectCompetitionExamTotalQuestions);
    const loading = useSelector(selectCompetitionExamLoading);
    const error = useSelector(selectCompetitionExamError);

    useEffect(() => {
        if (!competitionId) {
            dispatch(clearCompetitionExam());
            return;
        }

        dispatch(fetchCompetitionExam(competitionId));

        return () => {
            dispatch(clearCompetitionExam());
        };
    }, [dispatch, competitionId]);

    const normalizedError =
        !error
            ? ''
            : typeof error === 'string'
                ? error
                : error?.message || 'Không thể tải đề thi cuộc thi.';

    return (
        <section className="mt-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
                <h2 className="text-h4 text-gray-900">Thông tin đề thi</h2>
                {!competitionId ? (
                    <p className="mt-2 text-text-4 text-gray-600">Thiếu mã cuộc thi.</p>
                ) : normalizedError ? (
                    <p className="mt-2 text-text-4 text-red-600">{normalizedError}</p>
                ) : !loading && !examInfo ? (
                    <p className="mt-2 text-text-4 text-gray-600">Không có dữ liệu đề thi.</p>
                ) : (
                    <CompetitionExamDetailInfo
                        examInfo={examInfo}
                        sectionsWithQuestions={sectionsWithQuestions}
                        totalQuestions={totalQuestions}
                        loading={loading}
                    />
                )}
            </div>

            {!competitionId || normalizedError ? null : (
                <CompetitionExamSectionTabs
                    sectionsWithQuestions={sectionsWithQuestions}
                    loading={loading}
                />
            )}
        </section>
    );
};

export default CompetitionExamPage;
