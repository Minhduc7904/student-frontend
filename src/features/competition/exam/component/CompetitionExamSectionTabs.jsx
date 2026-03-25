import MarkdownRenderer from '../../../../shared/components/markdown/MarkdownRenderer';
import CompetitionExamSectionConfirmOverlay from './section-tabs/CompetitionExamSectionConfirmOverlay';
import CompetitionExamSectionLoading from './section-tabs/CompetitionExamSectionLoading';
import CompetitionExamQuestionList from './section-tabs/CompetitionExamQuestionList';
import useCompetitionExamSectionTabs from './section-tabs/useCompetitionExamSectionTabs';

const CompetitionExamSectionTabs = ({ sectionsWithQuestions = [], loading = false }) => {
    const {
        sectionTabs,
        activeSection,
        isConfirmed,
        setActiveSectionId,
        confirmView,
    } = useCompetitionExamSectionTabs({
        sectionsWithQuestions,
        loading,
    });

    return (
        <div className="relative mt-4 rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
            <h2 className="text-h4 text-gray-900">Nội dung theo phần</h2>

            <div className={isConfirmed || loading ? '' : 'pointer-events-none select-none blur-[2px]'}>
                {loading ? (
                    <CompetitionExamSectionLoading />
                ) : !sectionTabs.length ? (
                    <p className="mt-2 text-text-4 text-gray-600">Không có section trong đề thi.</p>
                ) : (
                    <>
                        <div className="mt-4 p-2">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {sectionTabs.map((section, index) => {
                                const isActive = section.identity === activeSection?.identity;
                                const questionCount = section?.questions?.length ?? 0;

                                return (
                                    <button
                                        key={section.identity}
                                        type="button"
                                        onClick={() => setActiveSectionId(section.identity)}
                                        className={`cursor-pointer group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-all duration-200 ${
                                            isActive
                                                ? 'border-blue-300 bg-linear-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-100'
                                                : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700'
                                        }`}
                                    >
                                        <span className="pr-2">{index + 1}. {section?.title || `Phần ${index + 1}`}</span>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                                                isActive
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
                                ) : (
                                    <p className="mt-3 text-sm text-gray-500">Section chưa có mô tả.</p>
                                )}

                                <CompetitionExamQuestionList questions={activeSection?.questions || []} />
                            </div>
                        ) : null}
                    </>
                )}
            </div>

            {!loading && !isConfirmed && sectionTabs.length ? (
                <CompetitionExamSectionConfirmOverlay onConfirm={confirmView} />
            ) : null}
        </div>
    );
};

export default CompetitionExamSectionTabs;
