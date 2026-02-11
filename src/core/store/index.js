import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../features/auth/store/authSlice'
import notificationReducer from '../../features/notification/store/notificationSlice'
import profileReducer from '../../features/profile/store/profileSlice'
// Import your reducers here

export const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authReducer,
    notification: notificationReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
