import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationService } from "../../../core/services/modules/notificationService";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
  // Toast notifications (old state - không đụng chạm)
  notifications: [],
  nextId: 1,

  // User notifications from backend (new state)
  myNotifications: [],
  reminderNotifications: [],
  stats: {
    total: 0,
    unread: 0,
    read: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  myNotificationsFetched: false,
  statsFetched: false,
  reminderFetched: false,
  myNotificationsRequestId: null,
  statsRequestId: null,
  reminderRequestId: null,
  loadingMyNotifications: false,
  loadingUserNotifications: false,
  loadingStats: false,
  loadingReminder: false,
  loadingMarkRead: false,
  loadingMarkAllRead: false,
  loadingDelete: false,
  loadingSend: false,
  error: null,
  reminderError: null,
  filters: {
    search: "",
    type: "", // SYSTEM, COURSE, LESSON, ATTENDANCE, GENERAL
    level: "", // INFO, WARNING, ERROR, SUCCESS
    isRead: "", // true, false, or empty for all
    sortBy: "createdAt",
    sortOrder: "desc",
    fromDate: "",
    toDate: "",
  },
};

// Async thunks
export const getMyNotificationsAsync = createAsyncThunk(
  "notification/getMyNotifications",
  async (params, thunkAPI) => {
    return handleAsyncThunk(() => notificationService.getMy(params), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi tải thông báo",
    });
  },
);

export const getMyStatsAsync = createAsyncThunk(
  "notification/getMyStats",
  async (_, thunkAPI) => {
    return handleAsyncThunk(() => notificationService.getMyStats(), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi tải thống kê thông báo",
    });
  },
);

export const getMyRemindersAsync = createAsyncThunk(
  "notification/getMyReminders",
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => notificationService.getMyReminders(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: "Lỗi tải thông báo nhắc nhở",
      },
    );
  },
);

export const markNotificationReadAsync = createAsyncThunk(
  "notification/markRead",
  async (id, thunkAPI) => {
    return handleAsyncThunk(() => notificationService.markRead(id), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi đánh dấu thông báo",
    });
  },
);

export const markAllReadAsync = createAsyncThunk(
  "notification/markAllRead",
  async (_, thunkAPI) => {
    return handleAsyncThunk(() => notificationService.markAllRead(), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi đánh dấu thông báo",
    });
  },
);

export const deleteNotificationAsync = createAsyncThunk(
  "notification/delete",
  async (id, thunkAPI) => {
    return handleAsyncThunk(() => notificationService.delete(id), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi xóa thông báo",
    });
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Toast notifications reducers (old - không đổi)
    addNotification: (state, action) => {
      const { type, title, message, autoHide } = action.payload;
      state.notifications.push({
        id: state.nextId++,
        type,
        title,
        message,
        autoHide: autoHide !== undefined ? autoHide : true,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // New reducers for backend notifications
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
    clearMyNotifications: (state) => {
      state.myNotifications = [];
      state.reminderNotifications = [];
      state.stats = { ...initialState.stats };
      state.pagination = { ...initialState.pagination };
      state.myNotificationsFetched = false;
      state.statsFetched = false;
      state.reminderFetched = false;
      state.myNotificationsRequestId = null;
      state.statsRequestId = null;
      state.reminderRequestId = null;
      state.loadingMyNotifications = false;
      state.loadingStats = false;
      state.loadingReminder = false;
      state.error = null;
      state.reminderError = null;
    },
    resetNotificationState: () => {
      return initialState;
    },
    // Real-time notification from socket
    addRealtimeNotification: (state, action) => {
      if (!state.myNotifications) {
        state.myNotifications = [];
      }
      // Chỉ thêm nếu chưa tồn tại notificationId
      const alreadyExists = state.myNotifications.some(
        (n) => n.notificationId === action.payload.notificationId,
      );
      if (alreadyExists) return;

      state.myNotifications.unshift(action.payload);
      state.stats.total += 1;
      state.stats.unread += 1;
      if (state.pagination) {
        state.pagination.total = (state.pagination.total || 0) + 1;
      }
      if (
        action.payload?.isRead === false &&
        (action.payload?.data?.shouldShowReminderModal === true ||
          action.payload?.data?.shouldShowReminderModal === "true")
      ) {
        const reminderExists = state.reminderNotifications.some(
          (notification) =>
            notification.notificationId === action.payload.notificationId,
        );
        if (!reminderExists) {
          state.reminderNotifications.unshift(action.payload);
        }
      }
    },
    // Update stats from socket
    updateStatsFromSocket: (state, action) => {
      state.stats = action.payload;
      state.statsFetched = true;
    },
    applyRealtimeNotificationRead: (state, action) => {
      const payload = action.payload || {};

      if (payload.all) {
        state.myNotifications = state.myNotifications.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString(),
        }));
        state.reminderNotifications = [];
        return;
      }

      const updatedNotification = payload.notification || payload;
      const index = state.myNotifications.findIndex(
        (notification) =>
          notification.notificationId === updatedNotification.notificationId,
      );
      if (index === -1) {
        if (updatedNotification.isRead) {
          state.reminderNotifications = state.reminderNotifications.filter(
            (notification) =>
              notification.notificationId !==
              updatedNotification.notificationId,
          );
        }
        return;
      }

      const wasUnread = !state.myNotifications[index].isRead;
      state.myNotifications[index] = updatedNotification;
      if (wasUnread && updatedNotification.isRead) {
        state.stats.unread = Math.max(0, state.stats.unread - 1);
        state.stats.read += 1;
      }
      if (updatedNotification.isRead) {
        state.reminderNotifications = state.reminderNotifications.filter(
          (notification) =>
            notification.notificationId !== updatedNotification.notificationId,
        );
      }
    },
    applyRealtimeNotificationDeleted: (state, action) => {
      const notificationId = action.payload?.notificationId ?? action.payload;
      const notification = state.myNotifications.find(
        (item) => item.notificationId === notificationId,
      );
      const reminderNotification = state.reminderNotifications.find(
        (item) => item.notificationId === notificationId,
      );
      if (!notification && !reminderNotification) return;

      state.myNotifications = state.myNotifications.filter(
        (item) => item.notificationId !== notificationId,
      );
      state.reminderNotifications = state.reminderNotifications.filter(
        (item) => item.notificationId !== notificationId,
      );
      const deletedNotification = notification || reminderNotification;
      state.stats.total = Math.max(0, state.stats.total - 1);
      if (deletedNotification.isRead) {
        state.stats.read = Math.max(0, state.stats.read - 1);
      } else {
        state.stats.unread = Math.max(0, state.stats.unread - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my notifications
      .addCase(getMyNotificationsAsync.pending, (state, action) => {
        state.myNotificationsRequestId = action.meta.requestId;
        if (state.pagination.page === 1) {
          state.myNotifications = [];
        }
        state.loadingMyNotifications = true;
        state.error = null;
      })
      .addCase(getMyNotificationsAsync.fulfilled, (state, action) => {
        if (state.myNotificationsRequestId !== action.meta.requestId) return;
        state.myNotificationsRequestId = null;
        state.loadingMyNotifications = false;
        // Append for infinite scroll
        const page =
          action.payload?.pagination?.page || action.payload?.meta?.page || 1;
        if (page === 1) {
          state.myNotifications = action.payload.data;
        } else {
          state.myNotifications = [
            ...state.myNotifications,
            ...action.payload.data,
          ];
        }
        state.pagination =
          action.payload.pagination || action.payload.meta || state.pagination;
        state.myNotificationsFetched = true;
        state.error = null;
      })
      .addCase(getMyNotificationsAsync.rejected, (state, action) => {
        if (state.myNotificationsRequestId !== action.meta.requestId) return;
        state.myNotificationsRequestId = null;
        state.myNotifications = [];
        state.myNotificationsFetched = false;
        state.loadingMyNotifications = false;
        state.error = action.payload;
      })

      // Get my stats
      .addCase(getMyStatsAsync.pending, (state, action) => {
        state.statsRequestId = action.meta.requestId;
        state.loadingStats = true;
        state.error = null;
      })
      .addCase(getMyStatsAsync.fulfilled, (state, action) => {
        if (state.statsRequestId !== action.meta.requestId) return;
        state.statsRequestId = null;
        state.loadingStats = false;
        state.stats = action.payload.data;
        state.statsFetched = true;
      })
      .addCase(getMyStatsAsync.rejected, (state, action) => {
        if (state.statsRequestId !== action.meta.requestId) return;
        state.statsRequestId = null;
        state.statsFetched = false;
        state.loadingStats = false;
        state.error = action.payload;
      })

      // Get reminder notifications independently from the bell list
      .addCase(getMyRemindersAsync.pending, (state, action) => {
        state.reminderRequestId = action.meta.requestId;
        state.reminderNotifications = [];
        state.loadingReminder = true;
        state.error = null;
        state.reminderError = null;
      })
      .addCase(getMyRemindersAsync.fulfilled, (state, action) => {
        if (state.reminderRequestId !== action.meta.requestId) return;
        state.reminderRequestId = null;
        state.loadingReminder = false;
        state.reminderNotifications = action.payload?.data || [];
        state.reminderFetched = true;
        state.error = null;
        state.reminderError = null;
      })
      .addCase(getMyRemindersAsync.rejected, (state, action) => {
        if (state.reminderRequestId !== action.meta.requestId) return;
        state.reminderRequestId = null;
        state.reminderNotifications = [];
        state.reminderFetched = false;
        state.loadingReminder = false;
        state.error = action.payload;
        state.reminderError = action.payload;
      })

      // Mark notification read
      .addCase(markNotificationReadAsync.pending, (state) => {
        state.loadingMarkRead = true;
        state.error = null;
      })
      .addCase(markNotificationReadAsync.fulfilled, (state, action) => {
        state.loadingMarkRead = false;
        const updatedNotification = action.payload.data;

        // Update in myNotifications
        const index = state.myNotifications.findIndex(
          (n) => n.notificationId === updatedNotification.notificationId,
        );
        const previousNotification =
          index !== -1 ? state.myNotifications[index] : null;
        const previousReminderNotification = state.reminderNotifications.find(
          (notification) =>
            notification.notificationId === updatedNotification.notificationId,
        );
        if (index !== -1) state.myNotifications[index] = updatedNotification;
        state.reminderNotifications = state.reminderNotifications.filter(
          (notification) =>
            notification.notificationId !== updatedNotification.notificationId,
        );

        // Update stats
        if (
          previousNotification &&
          !previousNotification.isRead &&
          updatedNotification.isRead
        ) {
          state.stats.unread = Math.max(0, state.stats.unread - 1);
          state.stats.read += 1;
        } else if (
          !previousNotification &&
          previousReminderNotification &&
          !previousReminderNotification.isRead &&
          updatedNotification.isRead
        ) {
          state.stats.unread = Math.max(0, state.stats.unread - 1);
          state.stats.read += 1;
        }
      })
      .addCase(markNotificationReadAsync.rejected, (state, action) => {
        state.loadingMarkRead = false;
        state.error = action.payload;
      })

      // Mark all read
      .addCase(markAllReadAsync.pending, (state) => {
        state.loadingMarkAllRead = true;
        state.error = null;
      })
      .addCase(markAllReadAsync.fulfilled, (state, action) => {
        state.loadingMarkAllRead = false;
        // Mark all as read in state
        state.myNotifications = state.myNotifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }));
        state.reminderNotifications = [];
        // Update stats
        state.stats.read = state.stats.total;
        state.stats.unread = 0;
      })
      .addCase(markAllReadAsync.rejected, (state, action) => {
        state.loadingMarkAllRead = false;
        state.error = action.payload;
      })

      // Delete notification
      .addCase(deleteNotificationAsync.pending, (state) => {
        state.loadingDelete = true;
        state.error = null;
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.loadingDelete = false;
        const deletedId = action.meta.arg;

        // Find the notification before removing
        const notification = state.myNotifications.find(
          (n) => n.notificationId === deletedId,
        );
        const reminderNotification = state.reminderNotifications.find(
          (n) => n.notificationId === deletedId,
        );

        // Remove from myNotifications
        state.myNotifications = state.myNotifications.filter(
          (n) => n.notificationId !== deletedId,
        );
        state.reminderNotifications = state.reminderNotifications.filter(
          (notification) => notification.notificationId !== deletedId,
        );

        // Update stats
        if (!notification && !reminderNotification) return;

        state.stats.total = Math.max(0, state.stats.total - 1);
        const deletedNotification = notification || reminderNotification;
        if (!deletedNotification.isRead) {
          state.stats.unread = Math.max(0, state.stats.unread - 1);
        } else if (deletedNotification.isRead) {
          state.stats.read = Math.max(0, state.stats.read - 1);
        }
      })
      .addCase(deleteNotificationAsync.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      });
  },
});

export const {
  // Old toast actions
  addNotification,
  removeNotification,
  clearNotifications,
  // New backend notification actions
  setFilters,
  resetFilters,
  setPagination,
  resetPagination,
  clearMyNotifications,
  resetNotificationState,
  addRealtimeNotification,
  updateStatsFromSocket,
  applyRealtimeNotificationRead,
  applyRealtimeNotificationDeleted,
} = notificationSlice.actions;

// Selectors
// Old toast selectors
export const selectToastNotifications = (state) =>
  state.notification.notifications;

// New backend notification selectors
export const selectMyNotifications = (state) =>
  state.notification.myNotifications;
export const selectNotificationStats = (state) => state.notification.stats;
export const selectNotificationPagination = (state) =>
  state.notification.pagination;
export const selectMyNotificationsFetched = (state) =>
  state.notification.myNotificationsFetched;
export const selectNotificationStatsFetched = (state) =>
  state.notification.statsFetched;
export const selectLoadingMyNotifications = (state) =>
  state.notification.loadingMyNotifications;
export const selectLoadingStats = (state) => state.notification.loadingStats;
export const selectReminderNotifications = (state) =>
  state.notification.reminderNotifications;
export const selectLoadingReminder = (state) =>
  state.notification.loadingReminder;
export const selectReminderFetched = (state) =>
  state.notification.reminderFetched;
export const selectReminderError = (state) => state.notification.reminderError;
export const selectLoadingMarkRead = (state) =>
  state.notification.loadingMarkRead;
export const selectLoadingMarkAllRead = (state) =>
  state.notification.loadingMarkAllRead;
export const selectLoadingDelete = (state) => state.notification.loadingDelete;
export const selectLoadingSend = (state) => state.notification.loadingSend;
export const selectNotificationError = (state) => state.notification.error;
export const selectNotificationFilters = (state) => state.notification.filters;

export default notificationSlice.reducer;
