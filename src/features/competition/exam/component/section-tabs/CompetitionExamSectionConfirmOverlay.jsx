const CompetitionExamSectionConfirmOverlay = ({ onConfirm }) => {
    return (
        <div className="absolute inset-0 z-20 flex items-start justify-center rounded-2xl bg-white/75 backdrop-blur-sm p-4">
            <div className="mt-20 max-w-xl rounded-xl border border-amber-200 bg-amber-50/95 px-5 py-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-amber-900 md:text-base">
                    Bạn có chắc chắn muốn xem đề thi trước chứ? Điều này sẽ ảnh hưởng đến việc thi cử.
                </p>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="cursor-pointer mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-amber-700"
                >
                    Tôi chắc chắn muốn xem
                </button>
            </div>
        </div>
    );
};

export default CompetitionExamSectionConfirmOverlay;
