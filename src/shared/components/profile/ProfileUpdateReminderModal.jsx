import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "../modal/Modal";
import { ROUTES, STORAGE_KEYS } from "../../../core/constants";
import { getItem, setItem } from "../../utils";
import { selectIsAuthenticated } from "../../../features/auth/store/authSlice";

const isReminderDone = () => {
    const stored = getItem(STORAGE_KEYS.PROFILE_UPDATE_REMINDER_DONE);
    return stored === true || stored === "true";
};

const markReminderDone = () => {
    setItem(STORAGE_KEYS.PROFILE_UPDATE_REMINDER_DONE, true);
};

const ProfileUpdateReminderModal = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsOpen(false);
            return;
        }

        setIsOpen(!isReminderDone());
    }, [isAuthenticated]);

    const handleSkip = () => {
        markReminderDone();
        setIsOpen(false);
    };

    const handleUpdateNow = () => {
        markReminderDone();
        setIsOpen(false);

        const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
        window.location.assign(`${window.location.origin}${basePath}${ROUTES.PROFILE_EDIT_INFO}`);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleSkip}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-slate-800">Cập nhật thông tin cá nhân</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Bạn vui lòng cập nhật thông tin cá nhân để hệ thống cá nhân hóa lộ trình học tập tốt hơn.
                </p>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Bỏ qua
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdateNow}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Cập nhật ngay
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileUpdateReminderModal;
