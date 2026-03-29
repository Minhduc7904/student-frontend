import { memo, useEffect, useMemo, useState } from 'react';
import MarkdownRenderer from '../../../../shared/components/markdown/MarkdownRenderer';
import PracticeAttemptQuestionList from './PracticeAttemptQuestionList';

const sortByOrderAsc = (items = []) => {
    return [...items].sort((a, b) => {
        const aOrder = a?.order;
        const bOrder = b?.order;

        if (aOrder == null && bOrder == null) return 0;
        if (aOrder == null) return 1;
        if (bOrder == null) return -1;

        return Number(aOrder) - Number(bOrder);
    });
};

const normalizeSectionsWithQuestions = (examContent) => {
    const rawSections = Array.isArray(examContent?.sections) ? examContent.sections : [];
    const rawQuestions = Array.isArray(examContent?.questions) ? examContent.questions : [];

    const sections = sortByOrderAsc(rawSections);
    const questions = sortByOrderAsc(rawQuestions);

    if (!sections.length && questions.length) {
        return [
            {
                sectionId: 'all',
                identity: 'all',
                title: 'Tất cả câu hỏi',
                processedDescription: null,
                description: null,
                questions,
            },
        ];
    }

    const sectionQuestions = sections.reduce((acc, section) => {
        acc[String(section?.sectionId)] = [];
        return acc;
    }, {});

    const otherQuestions = [];

    questions.forEach((question) => {
        const sectionKey = question?.sectionId == null ? null : String(question.sectionId);
        if (sectionKey && Object.prototype.hasOwnProperty.call(sectionQuestions, sectionKey)) {
            sectionQuestions[sectionKey].push(question);
            return;
        }
        otherQuestions.push(question);
    });

    const sectionsWithQuestions = sections.map((section, index) => {
        const identity = section?.sectionId == null ? `section-${index + 1}` : String(section.sectionId);
        return {
            ...section,
            identity,
            questions: sectionQuestions[identity] || [],
        };
    });

    if (otherQuestions.length) {
        sectionsWithQuestions.push({
            sectionId: 'other',
            identity: 'other',
            title: 'Khác',
            processedDescription: null,
            description: null,
            questions: otherQuestions,
        });
    }

    return sectionsWithQuestions;
};

const PracticeAttemptSectionTabs = ({
    examContent,
    loading = false,
    error = null,
    attemptId = null,
    onQuestionInteraction,
    onSubmitQuestionAnswer,
}) => {
    const sectionTabs = useMemo(() => normalizeSectionsWithQuestions(examContent), [examContent]);
    const [activeSectionId, setActiveSectionId] = useState('');

    useEffect(() => {
        if (!sectionTabs.length) {
            setActiveSectionId('');
            return;
        }

        const isCurrentTabValid = sectionTabs.some((section) => section.identity === activeSectionId);
        if (!isCurrentTabValid) {
            setActiveSectionId(sectionTabs[0].identity);
        }
    }, [sectionTabs, activeSectionId]);

    useEffect(() => {
        const handleNavigateQuestion = (event) => {
            const detail = event?.detail || {};
            const nextSectionIdentity = detail?.sectionIdentity;
            const questionId = detail?.questionId;

            if (nextSectionIdentity) {
                setActiveSectionId(String(nextSectionIdentity));
            }

            if (questionId == null) return;

            let attemptCount = 0;
            const maxAttempts = 12;

            const scrollToQuestion = () => {
                const targetElement = document.getElementById(`practice-question-${questionId}`);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                    return;
                }

                attemptCount += 1;
                if (attemptCount < maxAttempts) {
                    window.setTimeout(scrollToQuestion, 80);
                }
            };

            window.setTimeout(scrollToQuestion, 80);
        };

        window.addEventListener('practice-attempt:navigate-question', handleNavigateQuestion);

        return () => {
            window.removeEventListener('practice-attempt:navigate-question', handleNavigateQuestion);
        };
    }, []);

    const activeSection = useMemo(() => {
        if (!sectionTabs.length) return null;
        return sectionTabs.find((section) => section.identity === activeSectionId) || sectionTabs[0];
    }, [sectionTabs, activeSectionId]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
                <div className="animate-pulse space-y-3">
                    <div className="h-5 w-56 rounded bg-slate-200" />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={`practice-tab-skeleton-${index + 1}`} className="h-10 rounded-xl bg-slate-100" />
                        ))}
                    </div>
                    <div className="h-24 rounded-xl bg-slate-100" />
                </div>
            </div>
        );
    }

    if (error) {
        const normalizedError = typeof error === 'string' ? error : error?.message || 'Không thể tải câu hỏi luyện tập.';
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {normalizedError}
            </div>
        );
    }

    if (!sectionTabs.length) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Không có section trong đề thi.
            </div>
        );
    }

    return (
        <div className="relative rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <h2 className="text-h4 text-gray-900">Nội dung theo phần</h2>

            <div className="mt-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {sectionTabs.map((section, index) => {
                        const isActive = section.identity === activeSection?.identity;
                        const questionCount = section?.questions?.length ?? 0;

                        return (
                            <button
                                key={section.identity}
                                type="button"
                                onClick={() => setActiveSectionId(section.identity)}
                                className={`cursor-pointer group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-all duration-200 ${isActive
                                        ? 'border-blue-300 bg-linear-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-100'
                                        : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700'
                                    }`}
                            >
                                <span className="pr-2">{index + 1}. {section?.title || `Phần ${index + 1}`}</span>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                                        }`}
                                >
                                    {questionCount} câu
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeSection ? (
                <div className="mt-4 rounded-xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {activeSection?.title || 'Không có tiêu đề'}
                        </h3>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {activeSection?.questions?.length ?? 0} câu hỏi
                        </span>
                    </div>

                    {activeSection?.processedDescription || activeSection?.description ? (
                        <MarkdownRenderer
                            content={activeSection?.processedDescription || activeSection?.description}
                            className="mt-3 text-sm text-gray-700"
                        />
                    ) : null}

                    <PracticeAttemptQuestionList
                        questions={activeSection?.questions || []}
                        attemptId={attemptId}
                        sectionIdentity={activeSection?.identity || null}
                        onQuestionInteraction={onQuestionInteraction}
                        onSubmitQuestionAnswer={onSubmitQuestionAnswer}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default memo(PracticeAttemptSectionTabs);
