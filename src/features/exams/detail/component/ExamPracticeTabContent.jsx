import { memo, useMemo, useState } from 'react';
import { CustomCheckbox, CustomDropdown } from '../../../../shared/components';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../notification/store/notificationSlice';

const practiceTimeOptions = [
    { value: 10, label: '10 phút' },
    { value: 30, label: '30 phút' },
    { value: 60, label: '60 phút' },
    { value: 90, label: '90 phút' },
    { value: 120, label: '120 phút' },
    { value: 180, label: '180 phút' },
    { value: null, label: 'Vô hạn' },
];

const collectSectionChapters = (section) => {
    const chapterMap = new Map();
    const questions = Array.isArray(section?.questions) ? section.questions : [];

    questions.forEach((question) => {
        const chapters = Array.isArray(question?.chapters) ? question.chapters : [];

        chapters.forEach((chapter) => {
            const key = chapter?.chapterId != null
                ? String(chapter.chapterId)
                : String(chapter?.name || '').trim().toLowerCase();

            if (!key) return;

            if (!chapterMap.has(key)) {
                chapterMap.set(key, {
                    chapterId: chapter?.chapterId,
                    name: chapter?.name || 'Chưa có tên chương',
                    questionCount: 0,
                });
            }

            const existingChapter = chapterMap.get(key);
            existingChapter.questionCount += 1;
        });
    });

    return Array.from(chapterMap.values());
};

const ExamPracticeTabContent = ({ sectionsWithQuestions = [], examId, onStart, isStarting = false }) => {
    const dispatch = useDispatch();
    const [selectedSectionIds, setSelectedSectionIds] = useState([]);
    const [selectedPracticeDuration, setSelectedPracticeDuration] = useState(90);

    const sections = useMemo(() => {
        return Array.isArray(sectionsWithQuestions)
            ? sectionsWithQuestions.filter((section) => !section?.isSystemSection)
            : [];
    }, [sectionsWithQuestions]);

    const toggleSection = (sectionId) => {
        const normalizedId = String(sectionId);

        setSelectedSectionIds((prev) => {
            if (prev.includes(normalizedId)) {
                return prev.filter((id) => id !== normalizedId);
            }

            return [...prev, normalizedId];
        });
    };

    const selectedQuestionIds = useMemo(() => {
        if (selectedSectionIds.length === 0) return [];

        const questionIdSet = new Set();

        sections.forEach((section, index) => {
            const sectionId = String(section?.sectionId ?? index);

            if (!selectedSectionIds.includes(sectionId)) return;

            const questions = Array.isArray(section?.questions) ? section.questions : [];

            questions.forEach((question) => {
                const questionId = Number(question?.questionId);

                if (!Number.isNaN(questionId)) {
                    questionIdSet.add(questionId);
                }
            });
        });

        return Array.from(questionIdSet);
    }, [sections, selectedSectionIds]);

    const handleStartPractice = () => {
        if (!examId) return;

        if (selectedQuestionIds.length === 0) {
            dispatch(addNotification({
                type: 'warning',
                title: 'Chưa chọn câu hỏi',
                message: 'Vui lòng chọn ít nhất 1 section có câu hỏi để bắt đầu luyện tập.',
                autoHide: true,
            }));
            return;
        }

        onStart?.({
            examId,
            duration: selectedPracticeDuration,
            questionIds: selectedQuestionIds,
        });
    };

    if (sections.length === 0) {
        return (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                Chưa có section để luyện tập trong đề thi này.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sections.map((section, index) => {
                const sectionId = String(section?.sectionId ?? index);
                const isChecked = selectedSectionIds.includes(sectionId);
                const sectionTitle = section?.title || `Section ${index + 1}`;
                const description = section?.description || section?.processedDescription || 'Chưa có mô tả cho section này.';
                const sectionQuestionCount = Array.isArray(section?.questions) ? section.questions.length : 0;
                const chapters = collectSectionChapters(section);

                return (
                    <div
                        key={sectionId}
                        className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <CustomCheckbox
                                checked={isChecked}
                                onChange={() => toggleSection(sectionId)}
                                ariaLabel={`Chọn section ${sectionTitle}`}
                                className="mt-1"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-emerald-900">
                                    {sectionTitle}
                                    <span className="ml-2 text-xs font-medium text-emerald-800/80">
                                        ({sectionQuestionCount} câu hỏi)
                                    </span>
                                </p>
                                <p className="mt-1 text-sm text-emerald-800">{description}</p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {chapters.length > 0
                                        ? chapters.map((chapter) => (
                                            <span
                                                key={String(chapter.chapterId ?? chapter.name)}
                                                className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-700"
                                            >
                                                {chapter.name} ({chapter.questionCount})
                                            </span>
                                        ))
                                        : (
                                            <span className="text-xs text-emerald-700/80">Chưa có chapter trong section này.</span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-700">Thời gian làm bài:</p>
                        <CustomDropdown
                            id="practice-duration"
                            value={selectedPracticeDuration}
                            options={practiceTimeOptions}
                            onChange={setSelectedPracticeDuration}
                            buttonClassName="min-w-24 rounded-full border-slate-300 px-3 py-1 text-xs"
                            menuClassName="w-28"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleStartPractice}
                        disabled={!examId || isStarting}
                        className="cursor-pointer inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        {isStarting ? 'Đang bắt đầu...' : 'Bắt đầu làm bài'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ExamPracticeTabContent);
