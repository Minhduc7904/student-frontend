import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mediaService } from "../../../core/services/modules/mediaService";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    // Last uploaded media result
    uploadedMedia: null,
    // Upload progress (0-100)
    uploadProgress: 0,
    // Loading state
    loading: false,
    // Error
    error: null,
};

/**
 * Upload single media file
 * @param {File} file - File to upload
 */
export const uploadMediaAsync = createAsyncThunk(
    "media/upload",
    async (file, thunkAPI) => {
        return handleAsyncThunk(
            () =>
                mediaService.upload(file, {
                    onUploadProgress: (percent) => {
                        thunkAPI.dispatch(setUploadProgress(percent));
                    },
                }),
            thunkAPI,
            {
                successTitle: "Upload thành công",
                successMessage: "File đã được tải lên thành công",
                errorTitle: "Upload thất bại",
            }
        );
    }
);

/**
 * Upload multiple media files
 * @param {File[]} files - Array of files to upload
 */
export const uploadMultipleMediaAsync = createAsyncThunk(
    "media/uploadMultiple",
    async (files, thunkAPI) => {
        return handleAsyncThunk(
            () =>
                mediaService.uploadMultiple(files, {
                    onUploadProgress: (percent) => {
                        thunkAPI.dispatch(setUploadProgress(percent));
                    },
                }),
            thunkAPI,
            {
                successTitle: "Upload thành công",
                successMessage: `${files.length} file đã được tải lên thành công`,
                errorTitle: "Upload thất bại",
            }
        );
    }
);

const mediaSlice = createSlice({
    name: "media",
    initialState,
    reducers: {
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        clearUploadedMedia: (state) => {
            state.uploadedMedia = null;
            state.uploadProgress = 0;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Upload single
            .addCase(uploadMediaAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.uploadProgress = 0;
                state.uploadedMedia = null;
            })
            .addCase(uploadMediaAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.uploadedMedia = action.payload?.data ?? action.payload;
                state.uploadProgress = 100;
                state.error = null;
            })
            .addCase(uploadMediaAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.uploadProgress = 0;
            })
            // Upload multiple
            .addCase(uploadMultipleMediaAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.uploadProgress = 0;
                state.uploadedMedia = null;
            })
            .addCase(uploadMultipleMediaAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.uploadedMedia = action.payload?.data ?? action.payload;
                state.uploadProgress = 100;
                state.error = null;
            })
            .addCase(uploadMultipleMediaAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.uploadProgress = 0;
            });
    },
});

export const { setUploadProgress, clearUploadedMedia } = mediaSlice.actions;

// Selectors
export const selectUploadedMedia = (state) => state.media.uploadedMedia;
export const selectUploadProgress = (state) => state.media.uploadProgress;
export const selectMediaLoading = (state) => state.media.loading;
export const selectMediaError = (state) => state.media.error;

export default mediaSlice.reducer;
