import { Wrench } from 'lucide-react';
import { Modal } from './Modal';

/**
 * ComingSoonModal - Hiển thị thông báo chức năng đang being phát triển
 * Xuất hiện với animation nhảy lên (bounce-in)
 */
export function ComingSoonModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div
                className="animate-bounce-in bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center animate-bounce">
                    <Wrench className="w-8 h-8 text-yellow-500" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-h3 text-blue-800">
                        Tính năng đang phát triển
                    </h2>
                    <p className="text-text-4 text-gray-700">
                        Chức năng này hiện đang được phát triển và sẽ sớm ra mắt. Vui lòng quay lại sau!
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="mt-1 px-8 py-2.5 rounded-lg bg-blue-800 text-white text-h4 hover:bg-yellow-500 transition active:scale-[0.98] cursor-pointer"
                >
                    Đã hiểu
                </button>
            </div>
        </Modal>
    );
}
