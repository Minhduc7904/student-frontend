import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../../core/services/modules/authService";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";
import {
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
    setUserInfo,
    clearAuthData,
    isAuthenticated as checkAuth
} from "../../../shared/utils";

const initialState = {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    isAuthenticated: checkAuth(),
    loading: false,
    error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
    "auth/login",
    async (credentials, thunkAPI) => {
        return handleAsyncThunk(() => authService.login(credentials), thunkAPI, {
            successTitle: "Đăng nhập thành công",
            successMessage: "Chào mừng bạn quay trở lại!",
            errorTitle: "Đăng nhập thất bại",
        });
    }
);

export const registerAsync = createAsyncThunk(
    "auth/register",
    async (studentData, thunkAPI) => {
        return handleAsyncThunk(() => authService.register(studentData), thunkAPI, {
            successTitle: "Tạo tài khoản thành công",
            successMessage: "Đang đăng nhập vào tài khoản mới.",
            errorTitle: "Đăng ký thất bại",
        });
    }
);

export const logoutAsync = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        const { getState } = thunkAPI;
        return handleAsyncThunk(
            async () => {
                const { refreshToken } = getState().auth;
                if (refreshToken) {
                    return await authService.logout({ refreshToken });
                }
            },
            thunkAPI,
            {
                successTitle: "Đăng xuất thành công",
                successMessage: "Hẹn gặp lại bạn!",
                errorTitle: "Đã đăng xuất",
            }
        );
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, refreshToken, user } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            setAuthTokens(accessToken, refreshToken);
            if (user) {
                setUserInfo(user);
            }
        },
        clearAuth: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.error = null;

            clearAuthData();
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                const responseData = action.payload.data;
                const { tokens, user } = responseData;
                state.loading = false;
                state.accessToken = tokens.accessToken;
                state.refreshToken = tokens.refreshToken;
                state.isAuthenticated = true;
                state.error = null;

                setAuthTokens(tokens.accessToken, tokens.refreshToken);
                if (user) {
                    setUserInfo(user);
                }
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutAsync.fulfilled, (state) => {
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.error = null;

                clearAuthData();
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                clearAuthData();
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
    },
});

export const { setCredentials, clearAuth, clearError } = authSlice.actions;

// Selectors
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
