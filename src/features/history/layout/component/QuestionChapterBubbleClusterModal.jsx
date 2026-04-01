import { memo } from "react";
import { X } from "lucide-react";
import { Modal } from "../../../../shared/components/modal/Modal";
import QuestionChapterBubbleClusterCard from "./QuestionChapterBubbleClusterCard";

const QuestionChapterBubbleClusterModal = ({ isOpen, onClose, byChapter }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className="w-full max-w-6xl rounded-2xl bg-white p-4 shadow-2xl md:p-5"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-800 md:text-lg">Theo chapter - Biểu đồ phóng to</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        aria-label="Đóng modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                <QuestionChapterBubbleClusterCard
                    byChapter={byChapter}
                    variant="modal"
                    showExpandButton={false}
                />
            </div>
        </Modal>
    );
};

export default memo(QuestionChapterBubbleClusterModal);
