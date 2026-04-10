import YoutubeEmbed from "../../../../../shared/components/video/YoutubeEmbed";

const HomeworkSolutionVideoTab = ({ youtubeUrl }) => {
    if (!youtubeUrl) {
        return (
            <div className="py-12 flex flex-col gap-3 w-full justify-center items-center rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[14px] font-semibold text-gray-700 text-center">Chưa có video lời giải</span>
                <span className="text-[12px] text-gray-400 text-center px-4">
                    Bài tập này hiện chưa có đường dẫn video lời giải.
                </span>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
            <YoutubeEmbed url={youtubeUrl} title="Video lời giải" className="rounded-lg" />
        </div>
    );
};

export default HomeworkSolutionVideoTab;