import { memo } from "react";
import { X } from "lucide-react";
import { Modal } from "../../../../shared/components/modal/Modal";
import QuestionChapterBubbleClusterCard from "./QuestionChapterBubbleClusterCard";

const QuestionChapterBubbleClusterModal = ({ isOpen, onClose, byChapter }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className="w-full max-h-[90vh] max-w-[96vw] overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-[92vw] lg:max-w-6xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
                    <QuestionChapterBubbleClusterCard
                        byChapter={byChapter}
                        variant="modal"
                        showExpandButton={false}
                        onClose={onClose}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default memo(QuestionChapterBubbleClusterModal);
