import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OngDocSach1 from '../../../assets/images/OngDocSach1.png';
import OngDocSach2 from '../../../assets/images/OngDocSach2.png';
import { ROUTES } from '../../../core/constants';
import PracticeOptionCard from '../component/PracticeOptionCard';
import PracticeByChapterSidebar from './component/PracticeByChapterSidebar';
import {
    fetchPracticeByChapterChapters,
    fetchPracticeByChapterSubjects,
    selectPracticeByChapterChapters,
    selectPracticeByChapterChaptersError,
    selectPracticeByChapterChaptersFilters,
    selectPracticeByChapterChaptersPagination,
    selectPracticeByChapterLoadingChapters,
    selectPracticeByChapterLoadingSubjects,
    selectPracticeByChapterSelectedSubjectId,
    selectPracticeByChapterSubjects,
    selectPracticeByChapterSubjectsError,
    setChaptersFilters,
    setSelectedSubjectId,
} from './store';

const buildPathWithQuery = (path, query = {}) => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value));
        }
    });

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
};

const CHAPTER_OPTIONS = [
    {
        id: 'exam-library',
        title: 'Thư viện đề theo chương',
        subtitle: 'Chọn chương và bắt đầu luyện với bộ đề có sẵn.',
        badge: 'Đề mẫu',
        action: 'Vào luyện',
        to: ROUTES.EXAMS,
        metricCount: 24,
        gradientFrom: '#2563eb',
        gradientTo: '#60a5fa',
    },
    {
        id: 'wrong-questions',
        title: 'Ôn lại câu sai theo chương',
        subtitle: 'Tập trung vào những chủ đề bạn đang yếu nhất.',
        badge: 'Tập trung',
        action: 'Xem câu sai',
        to: ROUTES.HISTORY_QUESTION,
        metricCount: 10,
        gradientFrom: '#db2777',
        gradientTo: '#f472b6',
    },
];

const PracticeByChapterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedChapters, setSelectedChapters] = useState([]);

    const subjects = useSelector(selectPracticeByChapterSubjects);
    const chapters = useSelector(selectPracticeByChapterChapters);
    const selectedSubjectId = useSelector(selectPracticeByChapterSelectedSubjectId);
    const chaptersFilters = useSelector(selectPracticeByChapterChaptersFilters);
    const chaptersPagination = useSelector(selectPracticeByChapterChaptersPagination);
    const loadingSubjects = useSelector(selectPracticeByChapterLoadingSubjects);
    const loadingChapters = useSelector(selectPracticeByChapterLoadingChapters);
    const subjectsError = useSelector(selectPracticeByChapterSubjectsError);
    const chaptersError = useSelector(selectPracticeByChapterChaptersError);

    const selectedSubject = useMemo(
        () => subjects.find((subject) => String(subject.subjectId) === String(selectedSubjectId)) ?? null,
        [subjects, selectedSubjectId]
    );

    const selectedChapterIds = useMemo(
        () => selectedChapters.map((chapter) => String(chapter.chapterId)),
        [selectedChapters]
    );

    const isInitialChaptersLoading = loadingChapters && chapters.length === 0;

    useEffect(() => {
        dispatch(fetchPracticeByChapterSubjects());
    }, [dispatch]);

    useEffect(() => {
        if (!selectedSubjectId) return;

        dispatch(
            fetchPracticeByChapterChapters({
                subjectId: selectedSubjectId,
                page: 1,
                limit: chaptersFilters.limit,
                search: chaptersFilters.search,
            })
        );
    }, [dispatch, selectedSubjectId, chaptersFilters.limit, chaptersFilters.search]);

    useEffect(() => {
        setSelectedChapters([]);
    }, [selectedSubjectId]);

    const handleSelectSubject = (subjectId) => {
        dispatch(setSelectedSubjectId(subjectId));
    };

    const handleToggleChapter = useCallback((chapter) => {
        const chapterId = String(chapter?.chapterId);
        if (!chapterId) return;

        setSelectedChapters((previous) => {
            const alreadySelected = previous.some((item) => String(item.chapterId) === chapterId);

            if (alreadySelected) {
                return previous.filter((item) => String(item.chapterId) !== chapterId);
            }

            return [
                ...previous,
                {
                    chapterId,
                    chapterName: chapter?.chapterName || chapter?.name || `Chương ${chapterId}`,
                },
            ];
        });
    }, []);

    const handleRemoveSelectedChapter = useCallback((chapterId) => {
        const normalizedChapterId = String(chapterId);

        setSelectedChapters((previous) =>
            previous.filter((chapter) => String(chapter.chapterId) !== normalizedChapterId)
        );
    }, []);

    const handleChapterSearchChange = useCallback(
        (searchValue) => {
            if ((chaptersFilters.search || '') === searchValue) return;

            dispatch(
                setChaptersFilters({
                    search: searchValue,
                    page: 1,
                })
            );
        },
        [chaptersFilters.search, dispatch]
    );

    const handleLoadMoreChapters = () => {
        if (!selectedSubjectId || !chaptersPagination?.hasNextPage || loadingChapters) {
            return;
        }

        dispatch(
            fetchPracticeByChapterChapters({
                subjectId: selectedSubjectId,
                page: chaptersPagination.nextPage || chaptersPagination.page + 1,
                limit: chaptersFilters.limit,
                search: chaptersFilters.search,
            })
        );
    };

    const handleOpenPath = (path) => {
        const primaryChapterId = selectedChapterIds[0] || null;

        navigate(
            buildPathWithQuery(path, {
                subjectId: selectedSubjectId,
                chapterId: primaryChapterId,
                chapterIds: selectedChapterIds.join(','),
            })
        );
    };

    const chapterOptionCards = CHAPTER_OPTIONS.map((option, index) => ({
        ...option,
        imageSrc: index % 2 === 0 ? OngDocSach1 : OngDocSach2,
        metricCount:
            option.id === 'exam-library'
                ? chaptersPagination?.total || chapters.length
                : selectedChapters.length > 0
                    ? selectedChapters.length
                    : 0,
    }));

    return (
        <section className="w-full py-1">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:items-start">
                <PracticeByChapterSidebar
                    subjects={subjects}
                    chapters={chapters}
                    chaptersPagination={chaptersPagination}
                    selectedSubjectId={selectedSubjectId}
                    selectedChapterIds={selectedChapterIds}
                    chapterSearch={chaptersFilters.search}
                    loadingSubjects={loadingSubjects}
                    loadingChapters={loadingChapters}
                    subjectsError={subjectsError}
                    chaptersError={chaptersError}
                    onSelectSubject={handleSelectSubject}
                    onToggleChapter={handleToggleChapter}
                    onDebouncedSearch={handleChapterSearchChange}
                    onRetrySubjects={() => dispatch(fetchPracticeByChapterSubjects())}
                    onRetryChapters={() =>
                        selectedSubjectId &&
                        dispatch(
                            fetchPracticeByChapterChapters({
                                subjectId: selectedSubjectId,
                                page: 1,
                                limit: chaptersFilters.limit,
                                search: chaptersFilters.search,
                            })
                        )
                    }
                    onLoadMoreChapters={handleLoadMoreChapters}
                />

                <div className="rounded-3xl border border-blue-100 bg-white p-4 md:p-6">
                    <p className="text-h2 text-blue-800">Luyện theo chương</p>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
                        Chọn một cách luyện theo chương để bắt đầu. Bạn có thể làm đề mẫu theo từng chương
                        hoặc luyện lại các câu sai để củng cố kiến thức trọng tâm.
                    </p>

                    <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p>
                                    <span className="font-semibold">Môn đang chọn:</span>{' '}
                                    {selectedSubject?.name || 'Chưa chọn môn học'}
                                </p>
                                <p className="mt-1">
                                    <span className="font-semibold">Số chương đã chọn:</span>{' '}
                                    {selectedChapters.length}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 lg:max-w-[62%] lg:justify-end">
                                {selectedChapters.length > 0 ? (
                                    selectedChapters.map((chapter) => (
                                        <button
                                            key={chapter.chapterId}
                                            type="button"
                                            onClick={() => handleRemoveSelectedChapter(chapter.chapterId)}
                                            className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-700"
                                        >
                                            {chapter.chapterName}
                                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-[10px]">
                                                x
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-xs text-sky-700/80">Chưa chọn chương nào.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {chapterOptionCards.map((option) => (
                            <PracticeOptionCard
                                key={option.id}
                                title={option.title}
                                subtitle={option.subtitle}
                                badge={option.badge}
                                action={option.action}
                                imageSrc={option.imageSrc}
                                metricCount={option.metricCount}
                                gradientFrom={option.gradientFrom}
                                gradientTo={option.gradientTo}
                                disabled={!option.to}
                                onClick={() => option.to && handleOpenPath(option.to)}
                            />
                        ))}
                    </div>

                    {isInitialChaptersLoading ? (
                        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Đang tải danh sách chương...
                        </div>
                    ) : null}

                    {!isInitialChaptersLoading && !chaptersError && selectedSubjectId && chapters.length === 0 ? (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                            Môn học này hiện chưa có chương để luyện.
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default memo(PracticeByChapterPage);