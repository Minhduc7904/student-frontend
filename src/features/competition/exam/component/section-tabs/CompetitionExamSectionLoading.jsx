const CompetitionExamSectionLoading = () => {
    return (
        <div className="mt-3 space-y-3">
            <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={`section-tab-skeleton-${index + 1}`}
                        className="h-9 w-28 rounded-lg bg-gray-100 animate-pulse"
                    />
                ))}
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
                <div className="h-6 w-56 rounded bg-gray-100 animate-pulse" />
                <div className="mt-4 h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="mt-2 h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
                <div className="mt-2 h-4 w-4/6 rounded bg-gray-100 animate-pulse" />
            </div>
        </div>
    );
};

export default CompetitionExamSectionLoading;
