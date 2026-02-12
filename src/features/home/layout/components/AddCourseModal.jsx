import { memo, useState } from "react";
import { Modal } from "../../../../shared/components/modal/Modal";

/**
 * Add Course Modal Component
 * Modal để nhập mã khóa học
 */
const AddCourseModal = memo(({ isOpen, onClose }) => {
    const [courseCode, setCourseCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (courseCode.trim()) {
            // TODO: Xử lý thêm khóa học
            console.log("Course code:", courseCode);
            setCourseCode("");
            onClose();
        }
    };

    const handleClose = () => {
        setCourseCode("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div
                className="bg-white rounded-[12px] py-6 px-7 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-h3 text-blue-800 mb-4">
                    Tham gia khóa học
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="courseCode"
                            className="block text-text-3 font-medium text-gray-700 mb-2"
                        >
                            Nhập mã khóa học mà giáo viên đã chia sẻ với bạn.
                        </label>
                        <input
                            id="courseCode"
                            type="text"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            placeholder="Nhập mã khóa học..."
                            className="
                                w-full px-4 py-3
                                rounded-lg
                                border border-gray-300
                                text-text-4 text-gray-900
                                focus:outline-none
                                focus:ring-2 focus:ring-yellow-400
                                focus:border-yellow-400
                                transition
                            "
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                px-5 py-1.5
                                rounded-lg
                                border border-gray-300
                                text-text-4 font-medium text-gray-500
                                hover:bg-gray-50 hover:text-gray-800
                                cursor-pointer
                                active:scale-[0.98]
                                transition
                            "
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!courseCode.trim()}
                            className="
                                px-6 py-2.5
                                rounded-lg
                                bg-blue-800
                                text-text-4 font-medium text-white
                                hover:bg-[#183D87]
                                cursor-pointer
                                active:scale-[0.98]
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                            "
                        >
                            Thêm
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
});

AddCourseModal.displayName = "AddCourseModal";

export default AddCourseModal;
