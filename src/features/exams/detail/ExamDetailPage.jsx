import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../../../shared/components';
import ExamDetailInfoCard from './component/ExamDetailInfoCard';
import CompetitionExamSectionTabs from '../../competition/exam/component/CompetitionExamSectionTabs';
import {
    fetchPublicStudentExam,
    fetchPublicStudentExamDetail,
    selectCurrentExamContentId,
    selectCurrentExamDetailId,
    selectExamContent,
    selectExamContentError,
    selectExamContentLoading,
    selectExamContentSectionsWithQuestions,
    selectExamDetail,
    selectExamDetailError,
    selectExamDetailLoading,
} from './store/examDetailSlice';

const extractYoutubeVideoId = (url = '') => {
    if (!url) return '';

    try {
        const parsed = new URL(url);

        // 👉 youtu.be/abc123
        if (parsed.hostname.includes('youtu.be')) {
            return parsed.pathname.slice(1);
        }

        // 👉 youtube.com/watch?v=abc123
        const v = parsed.searchParams.get('v');
        if (v) return v;

        // 👉 youtube.com/embed/abc123
        if (parsed.pathname.includes('/embed/')) {
            return parsed.pathname.split('/embed/')[1];
        }

        return '';
    } catch {
        return '';
    }
};

const ExamDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { typeexam, id } = useParams();
    const examDetail = useSelector(selectExamDetail);
    const examContent = useSelector(selectExamContent);
    const examContentLoading = useSelector(selectExamContentLoading);
    const examContentError = useSelector(selectExamContentError);
    const sectionsWithQuestions = useSelector(selectExamContentSectionsWithQuestions);
    const loading = useSelector(selectExamDetailLoading);
    const error = useSelector(selectExamDetailError);
    const currentExamContentId = useSelector(selectCurrentExamContentId);
    const currentExamId = useSelector(selectCurrentExamDetailId);
    const [activeTab, setActiveTab] = useState('discussion');

    useEffect(() => {
        if (!id) return;
        if (String(currentExamId) === String(id) && examDetail) return;

        dispatch(fetchPublicStudentExamDetail(id));
    }, [dispatch, id, currentExamId, examDetail]);

    useEffect(() => {
        if (!id) return;
        if (String(currentExamContentId) === String(id) && examContent) return;

        dispatch(fetchPublicStudentExam(id));
    }, [dispatch, id, currentExamContentId, examContent]);

    const title = useMemo(() => {
        if (examDetail?.title) return examDetail.title;
        return `Chi tiết đề thi #${id || '--'}`;
    }, [examDetail, id]);

    const tabItems = useMemo(() => {
        const tabs = [
            { key: 'discussion', label: 'Thảo luận' },
        ];

        if (examDetail?.solutionYoutubeUrl) {
            tabs.push({ key: 'video-solution', label: 'Video chữa' });
        }

        tabs.push({ key: 'questions', label: 'Câu hỏi' });
        return tabs;
    }, [examDetail?.solutionYoutubeUrl]);

    useEffect(() => {
        if (!tabItems.some((tab) => tab.key === activeTab)) {
            setActiveTab(tabItems[0]?.key || 'discussion');
        }
    }, [activeTab, tabItems]);

    const videoEmbedUrl = useMemo(() => {
        const videoId = extractYoutubeVideoId(examDetail?.solutionYoutubeUrl || '');
        if (!videoId) return '';
        return `https://www.youtube.com/embed/${videoId}`;
    }, [examDetail?.solutionYoutubeUrl]);

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse space-y-3">
                    <div className="h-6 w-48 rounded bg-slate-200" />
                    <div className="h-4 w-80 rounded bg-slate-200" />
                    <div className="h-20 rounded-xl bg-slate-100" />
                </div>
            </Card>
        );
    }

    if (error) {
        const normalizedError = typeof error === 'string' ? error : error?.message || 'Không thể tải chi tiết đề thi.';

        return (
            <Card>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={18} className="mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">Tải dữ liệu thất bại</p>
                            <p className="mt-1 text-sm">{normalizedError}</p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft size={15} />
                    Quay lại
                </button>
            </Card>
        );
    }

    return (
        <section className="space-y-4">
            <ExamDetailInfoCard
                title={title}
                examDetail={examDetail}
                id={id}
                typeexam={typeexam}
                onBack={() => navigate(-1)}
            />

            <Card>
                <div className="border-b border-gray-100 px-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {tabItems.map((tab) => {
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-4">
                    {activeTab === 'discussion' ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                            Khu vực thảo luận sẽ sớm được cập nhật. Bạn có thể quay lại sau để xem các trao đổi về đề thi này.
                        </div>
                    ) : null}

                    {activeTab === 'video-solution' ? (
                        videoEmbedUrl
                            ? (
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                    <div className="aspect-video w-full">
                                        <iframe
                                            title="Video chữa đề"
                                            src={videoEmbedUrl}
                                            className="h-full w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )
                            : (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                    Không thể hiển thị video chữa do đường dẫn chưa hợp lệ.
                                </div>
                            )
                    ) : null}

                    {activeTab === 'questions' ? (
                        examContentError
                            ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {typeof examContentError === 'string'
                                        ? examContentError
                                        : examContentError?.message || 'Không thể tải nội dung câu hỏi.'}
                                </div>
                            )
                            : (
                                <CompetitionExamSectionTabs
                                    sectionsWithQuestions={sectionsWithQuestions}
                                    loading={examContentLoading}
                                />
                            )
                    ) : null}
                </div>
            </Card>
        </section>
    );
};

export default memo(ExamDetailPage);
