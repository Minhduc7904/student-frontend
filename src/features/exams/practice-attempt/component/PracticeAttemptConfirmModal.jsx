import { memo } from 'react';
import { Modal } from '../../../../shared/components/modal/Modal';

const modalContentClassName =
    'w-full max-w-md rounded-2xl border border-gray-200 bg-[#f5f7fb] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]';
const modalCancelButtonClassName =
    'cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300';
const modalPrimaryButtonClassName =
    'cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-blue-700';

const PracticeAttemptConfirmModal = ({
    isOpen,
    onClose,
    title,
    description,
    cancelLabel,
    confirmLabel,
    onConfirm,
    confirmIcon,
    showCancel = true,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} overlayClassName="bg-black/30 backdrop-blur-sm">
            <div
                className={modalContentClassName}
                onClick={(event) => event.stopPropagation()}
            >
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">{title}</h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    {showCancel ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className={modalCancelButtonClassName}
                        >
                            {cancelLabel}
                        </button>
                    ) : null}

                    <button
                        type="button"
                        onClick={onConfirm}
                        className={modalPrimaryButtonClassName}
                    >
                        {confirmIcon}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default memo(PracticeAttemptConfirmModal);
