import { addNotification } from '../../features/notification/store/notificationSlice';

/**
 * Helper function để xử lý async thunk với automatic notification
 * @param {Function} asyncFn - Async function cần thực thi
 * @param {Object} thunkAPI - ThunkAPI object từ createAsyncThunk (dispatch, rejectWithValue, getState)
 * @param {Object} messages - Object chứa success và error messages
 * @param {string} messages.successTitle - Tiêu đề notification khi thành công
 * @param {string} messages.successMessage - Nội dung notification khi thành công
 * @param {string} messages.errorTitle - Tiêu đề notification khi lỗi
 * @param {boolean} messages.showSuccess - Có hiển thị notification success hay không (default: true)
 * @returns {Promise} Response data hoặc rejectWithValue
 */
export const handleAsyncThunk = async (asyncFn, thunkAPI, messages = {}) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const {
    successTitle = 'Thành công',
    successMessage = '',
    errorTitle = 'Lỗi',
    showSuccess = true
  } = messages;

  try {
    const response = await asyncFn();
    if (showSuccess) {
      // Evaluate successMessage if it's a function
      const message = typeof successMessage === 'function'
        ? successMessage(response)
        : successMessage;

      dispatch(addNotification({
        type: 'success',
        title: successTitle,
        message: message,
        autoHide: true
      }));
    }

    return response.data ? response.data : response;
  } catch (error) {
    const errorMessage = error.message || 'Có lỗi xảy ra';
    dispatch(addNotification({
      type: 'error',
      title: errorTitle,
      message: errorMessage,
      autoHide: true
    }));
    return rejectWithValue(errorMessage);
  }
};
