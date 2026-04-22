import { memo, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { CustomDropdown, DebouncedSearchInput } from '../../../../shared/components';

const PracticeByChapterSidebar = ({
    subjects = [],
    chapters = [],
    chaptersPagination,
    selectedSubjectId,
    selectedChapterIds = [],
    chapterSearch = '',
    loadingSubjects,
    loadingChapters,
    subjectsError,
    chaptersError,
    onSelectSubject,
    onToggleChapter,
    onDebouncedSearch,
    onRetrySubjects,
    onRetryChapters,
    onLoadMoreChapters,
}) => {
    const loadMoreRef = useRef(null);

    const subjectOptions = subjects.map((subject) => ({
        value: String(subject.subjectId),
        label: subject.name,
    }));

    const hasNextChapterPage = Boolean(chaptersPagination?.hasNextPage);
    const isInitialChaptersLoading = loadingChapters && chapters.length === 0;

    const resolveChapterQuestionCount = (chapter) => {
        const rawValue =
            chapter?.questionCount ??
            chapter?.totalQuestions ??
            chapter?.questionsCount ??
            chapter?.totalQuestion ??
            0;

        const parsed = Number(rawValue);
        return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    };

    useEffect(() => {
        if (!loadMoreRef.current || !hasNextChapterPage || loadingChapters) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !loadingChapters && hasNextChapterPage) {
                    onLoadMoreChapters?.();
                }
            },
            { threshold: 0.6 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextChapterPage, loadingChapters, onLoadMoreChapters]);

    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 lg:sticky lg:top-4">
            <p className="text-base font-semibold text-slate-900">Chọn chương luyện</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Bắt đầu từ môn học, sau đó chọn chương để luyện tập đúng trọng tâm.
            </p>

            <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Môn học</p>

                {loadingSubjects ? (
                    <div className="mt-2 space-y-2">
                        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                    </div>
                ) : null}

                {!loadingSubjects && subjectsError ? (
                    <div className="mt-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                        <p>{subjectsError}</p>
                        <button
                            type="button"
                            onClick={onRetrySubjects}
                            className="mt-2 cursor-pointer rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white"
                        >
                            Tải lại
                        </button>
                    </div>
                ) : null}

                {!loadingSubjects && !subjectsError ? (
                    <div className="mt-2 space-y-1.5">
                        {subjects.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                                Chưa có môn học nào để hiển thị.
                            </p>
                        ) : (
                            <CustomDropdown
                                id="practice-by-chapter-subject"
                                value={selectedSubjectId || ''}
                                options={subjectOptions}
                                onChange={onSelectSubject}
                                placeholder="Chọn môn học"
                                buttonClassName="w-full rounded-xl border-slate-200 px-3 py-2 text-sm"
                                menuClassName="left-0 right-auto w-full"
                            />
                        )}
                    </div>
                ) : null}
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Danh sách chương</p>
                    <span className="text-[11px] text-slate-500">
                        {chaptersPagination?.total ?? chapters.length} chương
                    </span>
                </div>

                <DebouncedSearchInput
                    value={chapterSearch}
                    onDebouncedChange={onDebouncedSearch}
                    placeholder="Tìm chương..."
                    debounceMs={500}
                    disabled={!selectedSubjectId || loadingSubjects}
                    containerClassName="mt-2 w-full"
                    inputClassName="rounded-xl bg-slate-100 py-2 text-xs"
                />

                {isInitialChaptersLoading ? (
                    <div className="mt-2 space-y-2">
                        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
                    </div>
                ) : null}

                {!isInitialChaptersLoading && chaptersError ? (
                    <div className="mt-2 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                        <p>{chaptersError}</p>
                        <button
                            type="button"
                            onClick={onRetryChapters}
                            className="mt-2 cursor-pointer rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white"
                        >
                            Tải lại
                        </button>
                    </div>
                ) : null}

                {!isInitialChaptersLoading && !chaptersError ? (
                    <div className="mt-2 max-h-80 space-y-1.5 overflow-y-auto pr-1">
                        {chapters.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                                Chưa có chương cho môn học này.
                            </p>
                        ) : (
                            chapters.map((chapter, index) => {
                                const isActive = selectedChapterIds.includes(String(chapter.chapterId));
                                const questionCount = resolveChapterQuestionCount(chapter);

                                return (
                                    <button
                                        type="button"
                                        key={chapter.chapterId}
                                        onClick={() => onToggleChapter?.(chapter)}
                                        className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                                            isActive
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="truncate pr-2">{chapter.chapterName || `Chương ${index + 1}`}</span>

                                            <div className="flex shrink-0 items-center gap-1.5">
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                    {questionCount} câu
                                                </span>

                                                {isActive ? (
                                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                                                        <Check size={10} />
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}

                        {chapters.length > 0 ? (
                            <div className="mt-2 space-y-2">
                                <p className="text-[11px] text-slate-500">
                                    Trang {chaptersPagination?.page || 1}/{chaptersPagination?.totalPages || 1}
                                </p>

                                {loadingChapters ? (
                                    <p className="text-[11px] text-slate-500">Đang tải thêm chương...</p>
                                ) : null}

                                {hasNextChapterPage ? <div ref={loadMoreRef} className="h-5 w-full" /> : null}
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </aside>
    );
};

export default memo(PracticeByChapterSidebar);
