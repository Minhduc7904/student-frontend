import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../modal/Modal';
import { MarkdownRenderer } from '../markdown';
import { NOTIFICATION_LEVEL_UI } from '../../../core/constants/notificationConstants';
import { selectIsAuthenticated } from '../../../features/auth/store/authSlice';
import {
    getMyNotificationsAsync,
    markNotificationReadAsync,
    selectLoadingMyNotifications,
    selectMyNotifications,
    selectMyNotificationsFetched,
} from '../../../features/notification/store/notificationSlice';

const LEVEL_LABELS_VI = {
    INFO: 'Thông tin',
    SUCCESS: 'Thành công',
    WARNING: 'Cảnh báo',
    ERROR: 'Lỗi',
};

const NotificationReminderModal = () => {
    const dispatch = useDispatch();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const myNotifications = useSelector(selectMyNotifications);
    const myNotificationsFetched = useSelector(selectMyNotificationsFetched);
    const loadingMyNotifications = useSelector(selectLoadingMyNotifications);

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);

    const reminderNotifications = useMemo(
        () =>
            (myNotifications || []).filter(
                (notification) =>
                    notification?.data?.shouldShowReminderModal === true &&
                    notification?.isRead === false
            ),
        [myNotifications]
    );

    useEffect(() => {
        if (!isAuthenticated || myNotificationsFetched || loadingMyNotifications) {
            return;
        }

        dispatch(getMyNotificationsAsync({ page: 1, limit: 50 }));
    }, [dispatch, isAuthenticated, myNotificationsFetched, loadingMyNotifications]);

    useEffect(() => {
        if (!isAuthenticated || reminderNotifications.length === 0) {
            setIsOpen(false);
            setCurrentIndex(0);
            return;
        }

        setIsOpen(true);
        setCurrentIndex((prev) => Math.min(prev, reminderNotifications.length - 1));
    }, [isAuthenticated, reminderNotifications.length]);

    const currentNotification = reminderNotifications[currentIndex] || null;
    const reminderData = currentNotification?.data || {};

    const reminderTitle =
        reminderData.title || currentNotification?.title || 'Thông báo nhắc nhở';
    const reminderMessage =
        reminderData.message ||
        currentNotification?.message ||
        'Bạn có một thông báo cần xem.';
    const shouldRenderMarkdown =
        reminderData.isMarkdown === true || reminderData.isMarkdown === 'true';

    const reminderLevel = String(
        reminderData.level || currentNotification?.level || 'INFO'
    ).toUpperCase();
    const reminderLevelLabel = LEVEL_LABELS_VI[reminderLevel] || LEVEL_LABELS_VI.INFO;
    const levelUI = NOTIFICATION_LEVEL_UI[reminderLevel] || NOTIFICATION_LEVEL_UI.INFO;
    const LevelIcon = levelUI.icon;

    const levelTheme = {
        INFO: {
            panelClass: 'border-blue-200 bg-blue-50',
            iconWrapClass: 'bg-blue-100 text-blue-800',
            titleClass: 'text-blue-900',
            badgeClass: 'bg-blue-100 text-blue-800',
            primaryButtonClass: 'bg-blue-600 hover:bg-blue-700',
        },
        SUCCESS: {
            panelClass: 'border-green-200 bg-green-50',
            iconWrapClass: 'bg-green-100 text-green-700',
            titleClass: 'text-green-900',
            badgeClass: 'bg-green-100 text-green-700',
            primaryButtonClass: 'bg-green-600 hover:bg-green-700',
        },
        WARNING: {
            panelClass: 'border-yellow-200 bg-yellow-50',
            iconWrapClass: 'bg-yellow-100 text-yellow-700',
            titleClass: 'text-yellow-900',
            badgeClass: 'bg-yellow-100 text-yellow-700',
            primaryButtonClass: 'bg-yellow-600 hover:bg-yellow-700',
        },
        ERROR: {
            panelClass: 'border-red-200 bg-red-50',
            iconWrapClass: 'bg-red-100 text-red-700',
            titleClass: 'text-red-900',
            badgeClass: 'bg-red-100 text-red-700',
            primaryButtonClass: 'bg-red-600 hover:bg-red-700',
        },
    };
    const activeTheme = levelTheme[reminderLevel] || levelTheme.INFO;

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === reminderNotifications.length - 1;

    const handlePrevious = () => {
        if (isFirst) return;
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (isLast) return;
        setCurrentIndex((prev) => prev + 1);
    };

    const handleComplete = async () => {
        if (isCompleting || reminderNotifications.length === 0) {
            return;
        }

        setIsCompleting(true);

        const markReadJobs = reminderNotifications.map((notification) =>
            dispatch(markNotificationReadAsync(notification.notificationId)).unwrap()
        );

        const results = await Promise.allSettled(markReadJobs);
        const hasError = results.some((result) => result.status === 'rejected');

        setIsCompleting(false);

        if (!hasError) {
            setIsOpen(false);
            setCurrentIndex(0);
        }
    };

    if (!isOpen || !currentNotification) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-800">Thông báo</h2>
                    <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${activeTheme.badgeClass}`}>
                            {reminderLevelLabel}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {currentIndex + 1}/{reminderNotifications.length}
                        </span>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5">
                    {reminderNotifications.map((notification, index) => {
                        const dotKey = notification.notificationId || index;
                        const isActiveDot = index === currentIndex;

                        return (
                            <span
                                key={dotKey}
                                className={`h-2 rounded-full transition-all ${
                                    isActiveDot
                                        ? `w-5 ${activeTheme.badgeClass}`
                                        : 'w-2 bg-slate-300'
                                }`}
                                aria-label={`Thông báo ${index + 1}`}
                            />
                        );
                    })}
                </div>

                <div className={`mt-3 rounded-xl border p-4 ${activeTheme.panelClass}`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-lg p-2 ${activeTheme.iconWrapClass}`}>
                            <LevelIcon size={16} />
                        </div>
                        <div>
                            <h3 className={`text-sm font-semibold ${activeTheme.titleClass}`}>{reminderTitle}</h3>
                            {shouldRenderMarkdown ? (
                                <div className="mt-2 text-sm leading-6 text-slate-700">
                                    <MarkdownRenderer
                                        content={reminderMessage}
                                        className="text-sm leading-6 text-slate-700"
                                        imgClassNameSize="max-w-full max-h-64"
                                    />
                                </div>
                            ) : (
                                <p className="mt-2 text-sm leading-6 text-slate-700">{reminderMessage}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={isFirst || isCompleting}
                        className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Trước
                    </button>

                    {!isLast ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className={`cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors ${activeTheme.primaryButtonClass}`}
                        >
                            Tiếp theo
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleComplete}
                            disabled={isCompleting}
                            className={`cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${activeTheme.primaryButtonClass}`}
                        >
                            {isCompleting ? 'Đang hoàn tất...' : 'Hoàn tất'}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default NotificationReminderModal;
