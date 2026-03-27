import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "../../../core/services/modules/profileService";
import { competitionService } from "../../../core/services/modules/competitionService";
import { questionAnswerService } from "../../../core/services/modules/questionAnswerService";
import { examAttemptService } from "../../../core/services/modules/examAttemptService";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    myProfile: null,
    profile: null,
    loading: false,
    error: null,
    myProfileLoading: false,
    myProfileError: null,
    studentProfileLoading: false,
    studentProfileError: null,
    permissions: [],
    roles: [],
    difficultyStats: null,
    difficultyStatsLoading: false,
    difficultyStatsError: null,
    activityYearStats: null,
    activityYearStatsLoading: false,
    activityYearStatsError: null,
    publicStudentSubmittedHistory: null,
    publicStudentSubmittedHistoryLoading: false,
    publicStudentSubmittedHistoryError: null,
    publicStudentQuestionAnswers: null,
    publicStudentQuestionAnswersLoading: false,
    publicStudentQuestionAnswersError: null,
    publicStudentExamAttempts: null,
    publicStudentExamAttemptsLoading: false,
    publicStudentExamAttemptsError: null,
    editInfoTab: "basic",
    settingTab: "password",
};

// Async thunks
export const getMyProfileAsync = createAsyncThunk(
    "profile/getMyProfile",
    async (_, thunkAPI) => {
        return handleAsyncThunk(() => profileService.getProfile(), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin",
        });
    }
);

export const getProfileAsync = createAsyncThunk(
    "profile/getProfile",
    async (payload = {}, thunkAPI) => {
        const query = payload?.studentId ? { studentId: payload.studentId } : {};
        return handleAsyncThunk(() => profileService.getProfile(query), thunkAPI, {
            showSuccess: false, // Không hiện thông báo khi lấy profile
            errorTitle: "Lỗi tải thông tin",
        });
    }
);

export const updateProfileAsync = createAsyncThunk(
    "profile/updateProfile",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => profileService.updateProfile(data), thunkAPI, {
            successTitle: "Cập nhật thành công",
            successMessage: "Thông tin của bạn đã được cập nhật",
            errorTitle: "Cập nhật thất bại",
        });
    }
);

export const changePasswordAsync = createAsyncThunk(
    "profile/changePassword",
    async ({ oldPassword, newPassword }, thunkAPI) => {
        return handleAsyncThunk(
            () => profileService.changePassword({ oldPassword, newPassword }),
            thunkAPI,
            {
                successTitle: "Đổi mật khẩu thành công",
                successMessage: "Mật khẩu của bạn đã được cập nhật",
                errorTitle: "Đổi mật khẩu thất bại",
            }
        );
    }
);

export const uploadAvatarAsync = createAsyncThunk(
    "profile/uploadAvatar",
    async ({ file, onUploadProgress }, thunkAPI) => {
        return handleAsyncThunk(
            () => profileService.uploadAvatar(file, { onUploadProgress }),
            thunkAPI,
            {
                successTitle: "Cập nhật avatar thành công",
                successMessage: "Ảnh đại diện của bạn đã được cập nhật",
                errorTitle: "Upload avatar thất bại",
            }
        );
    }
);

export const getDifficultyStatsAsync = createAsyncThunk(
    "profile/getDifficultyStats",
    async (payload = {}, thunkAPI) => {
        const query = payload?.studentId ? { studentId: payload.studentId } : {};
        return handleAsyncThunk(() => profileService.getDifficultyStats(query), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thống kê độ khó",
        });
    }
);

export const getActivityYearStatsAsync = createAsyncThunk(
    "profile/getActivityYearStats",
    async (payload, thunkAPI) => {
        const targetYear =
            typeof payload === "number"
                ? payload
                : payload?.year || new Date().getFullYear();
        const query =
            typeof payload === "number" || !payload?.studentId
                ? {}
                : { studentId: payload.studentId };

        return handleAsyncThunk(() => profileService.getActivityYearStats(targetYear, query), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thống kê hoạt động năm",
        });
    }
);

export const getPublicStudentSubmittedHistoryAsync = createAsyncThunk(
    "profile/getPublicStudentSubmittedHistory",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentSubmittedHistory(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải lịch sử đã nộp cuộc thi",
            }
        );
    }
);

export const getPublicStudentQuestionAnswersAsync = createAsyncThunk(
    "profile/getPublicStudentQuestionAnswers",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => questionAnswerService.getPublicStudentQuestionAnswers(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải lịch sử câu trả lời",
            }
        );
    }
);

export const getPublicStudentExamAttemptsAsync = createAsyncThunk(
    "profile/getPublicStudentExamAttempts",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttempts(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải lịch sử bài thi",
            }
        );
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.myProfile = null;
            state.profile = null;
            state.error = null;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setEditInfoTab: (state, action) => {
            state.editInfoTab = action.payload;
        },
        setSettingTab: (state, action) => {
            state.settingTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get My Profile
            .addCase(getMyProfileAsync.pending, (state) => {
                state.permissions = [];
                state.myProfileLoading = true;
                state.myProfileError = null;
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyProfileAsync.fulfilled, (state, action) => {
                state.myProfileLoading = false;
                state.myProfileError = null;
                state.loading = false;
                state.myProfile = action.payload.data;
                state.profile = action.payload.data;
                const roles = action.payload.data.roles || [];
                state.roles = roles;
                if (roles.length > 0) {
                    const permissionsSet = new Set();
                    roles.forEach((role) => {
                        const rolePermissions = role.permissions || [];
                        rolePermissions.forEach((perm) => permissionsSet.add(perm));
                    });
                    state.permissions = Array.from(permissionsSet);
                } else {
                    state.permissions = [];
                }
                state.error = null;
            })
            .addCase(getMyProfileAsync.rejected, (state, action) => {
                state.permissions = [];
                state.myProfile = null;
                state.profile = null;
                state.myProfileLoading = false;
                state.myProfileError = action.payload;
                state.loading = false;
                state.error = action.payload;
            })
            // Get Profile
            .addCase(getProfileAsync.pending, (state) => {
                // state.profile = null;
                state.studentProfileLoading = true;
                state.studentProfileError = null;
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfileAsync.fulfilled, (state, action) => {
                state.studentProfileLoading = false;
                state.studentProfileError = null;
                state.loading = false;
                state.profile = action.payload.data;
                state.error = null;
            })
            .addCase(getProfileAsync.rejected, (state, action) => {
                state.studentProfileLoading = false;
                state.studentProfileError = action.payload;
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfileAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                const updatedFields = action.payload?.data || {};
                state.loading = false;

                state.myProfile = state.myProfile
                    ? { ...state.myProfile, ...updatedFields }
                    : updatedFields;

                const viewedProfile = state.profile;
                if (viewedProfile) {
                    const myProfileIds = [
                        state.myProfile?.studentId,
                        state.myProfile?.id,
                        state.myProfile?.userId,
                        state.myProfile?.student?.id,
                    ]
                        .filter((value) => value !== undefined && value !== null && value !== "")
                        .map((value) => String(value));

                    const viewedProfileIds = [
                        viewedProfile?.studentId,
                        viewedProfile?.id,
                        viewedProfile?.userId,
                        viewedProfile?.student?.id,
                    ]
                        .filter((value) => value !== undefined && value !== null && value !== "")
                        .map((value) => String(value));

                    const isViewingMyProfile = viewedProfileIds.some((id) => myProfileIds.includes(id));
                    if (isViewingMyProfile) {
                        state.profile = { ...viewedProfile, ...updatedFields };
                    }
                }

                state.error = null;
            })
            .addCase(updateProfileAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload Avatar
            .addCase(uploadAvatarAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(uploadAvatarAsync.fulfilled, (state, action) => {
                const media = action.payload?.data;
                if (state.myProfile && media?.viewUrl) {
                    state.myProfile.avatarUrl = media.viewUrl;
                }
                state.error = null;
            })
            .addCase(uploadAvatarAsync.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Difficulty Stats
            .addCase(getDifficultyStatsAsync.pending, (state) => {
                state.difficultyStatsLoading = true;
                state.difficultyStatsError = null;
            })
            .addCase(getDifficultyStatsAsync.fulfilled, (state, action) => {
                state.difficultyStatsLoading = false;
                state.difficultyStats = action.payload.data;
                state.difficultyStatsError = null;
            })
            .addCase(getDifficultyStatsAsync.rejected, (state, action) => {
                state.difficultyStatsLoading = false;
                state.difficultyStatsError = action.payload;
            })
            // Activity Year Stats
            .addCase(getActivityYearStatsAsync.pending, (state) => {
                state.activityYearStatsLoading = true;
                state.activityYearStatsError = null;
            })
            .addCase(getActivityYearStatsAsync.fulfilled, (state, action) => {
                state.activityYearStatsLoading = false;
                state.activityYearStats = action.payload.data;
                state.activityYearStatsError = null;
            })
            .addCase(getActivityYearStatsAsync.rejected, (state, action) => {
                state.activityYearStatsLoading = false;
                state.activityYearStatsError = action.payload;
            })
            // Public Student Submitted Competition History
            .addCase(getPublicStudentSubmittedHistoryAsync.pending, (state) => {
                state.publicStudentSubmittedHistoryLoading = true;
                state.publicStudentSubmittedHistoryError = null;
            })
            .addCase(getPublicStudentSubmittedHistoryAsync.fulfilled, (state, action) => {
                state.publicStudentSubmittedHistoryLoading = false;
                state.publicStudentSubmittedHistory = action.payload.data;
                state.publicStudentSubmittedHistoryError = null;
            })
            .addCase(getPublicStudentSubmittedHistoryAsync.rejected, (state, action) => {
                state.publicStudentSubmittedHistoryLoading = false;
                state.publicStudentSubmittedHistoryError = action.payload;
            })
            // Public Student Question Answers
            .addCase(getPublicStudentQuestionAnswersAsync.pending, (state) => {
                state.publicStudentQuestionAnswersLoading = true;
                state.publicStudentQuestionAnswersError = null;
            })
            .addCase(getPublicStudentQuestionAnswersAsync.fulfilled, (state, action) => {
                state.publicStudentQuestionAnswersLoading = false;
                state.publicStudentQuestionAnswers = action.payload.data;
                state.publicStudentQuestionAnswersError = null;
            })
            .addCase(getPublicStudentQuestionAnswersAsync.rejected, (state, action) => {
                state.publicStudentQuestionAnswersLoading = false;
                state.publicStudentQuestionAnswersError = action.payload;
            })
            // Public Student Exam Attempts
            .addCase(getPublicStudentExamAttemptsAsync.pending, (state) => {
                state.publicStudentExamAttemptsLoading = true;
                state.publicStudentExamAttemptsError = null;
            })
            .addCase(getPublicStudentExamAttemptsAsync.fulfilled, (state, action) => {
                state.publicStudentExamAttemptsLoading = false;
                state.publicStudentExamAttempts = action.payload.data;
                state.publicStudentExamAttemptsError = null;
            })
            .addCase(getPublicStudentExamAttemptsAsync.rejected, (state, action) => {
                state.publicStudentExamAttemptsLoading = false;
                state.publicStudentExamAttemptsError = action.payload;
            })
    },
});

export const { clearProfile, setProfile, setEditInfoTab, setSettingTab } = profileSlice.actions;

// Selectors
export const selectMyProfile = (state) => state.profile.myProfile;
export const selectProfile = (state) => state.profile.profile;
export const selectMyProfileLoading = (state) => state.profile.myProfileLoading;
export const selectMyProfileError = (state) => state.profile.myProfileError;
export const selectStudentProfileLoading = (state) => state.profile.studentProfileLoading;
export const selectStudentProfileError = (state) => state.profile.studentProfileError;
export const selectProfileLoading = (state) =>
    state.profile.myProfileLoading || state.profile.studentProfileLoading;
export const selectProfileError = (state) =>
    state.profile.studentProfileError ?? state.profile.myProfileError;
export const selectProfilePermissions = (state) => {
    const myRoles = state.profile.myProfile?.roles || [];
    if (myRoles.length > 0) {
        const permissionsSet = new Set();
        myRoles.forEach((role) => {
            const rolePermissions = role.permissions || [];
            rolePermissions.forEach((perm) => permissionsSet.add(perm));
        });
        return Array.from(permissionsSet);
    }

    return state.profile.permissions;
};
export const selectProfileRoles = (state) => state.profile.myProfile?.roles || state.profile.roles;
export const selectDifficultyStats = (state) => state.profile.difficultyStats;
export const selectDifficultyStatsLoading = (state) => state.profile.difficultyStatsLoading;
export const selectDifficultyStatsError = (state) => state.profile.difficultyStatsError;
export const selectActivityYearStats = (state) => state.profile.activityYearStats;
export const selectActivityYearStatsLoading = (state) => state.profile.activityYearStatsLoading;
export const selectActivityYearStatsError = (state) => state.profile.activityYearStatsError;
export const selectPublicStudentSubmittedHistory = (state) => state.profile.publicStudentSubmittedHistory;
export const selectPublicStudentSubmittedHistoryLoading = (state) => state.profile.publicStudentSubmittedHistoryLoading;
export const selectPublicStudentSubmittedHistoryError = (state) => state.profile.publicStudentSubmittedHistoryError;
export const selectPublicStudentQuestionAnswers = (state) => state.profile.publicStudentQuestionAnswers;
export const selectPublicStudentQuestionAnswersLoading = (state) => state.profile.publicStudentQuestionAnswersLoading;
export const selectPublicStudentQuestionAnswersError = (state) => state.profile.publicStudentQuestionAnswersError;
export const selectPublicStudentExamAttempts = (state) => state.profile.publicStudentExamAttempts;
export const selectPublicStudentExamAttemptsLoading = (state) => state.profile.publicStudentExamAttemptsLoading;
export const selectPublicStudentExamAttemptsError = (state) => state.profile.publicStudentExamAttemptsError;
export const selectEditInfoTab = (state) => state.profile.editInfoTab;
export const selectSettingTab = (state) => state.profile.settingTab;

export default profileSlice.reducer;


