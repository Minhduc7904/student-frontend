import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../features/auth/store/authSlice'
import notificationReducer from '../../features/notification/store/notificationSlice'
import profileReducer from '../../features/profile/store/profileSlice'
import courseEnrollmentReducer from '../../features/course-enrollment/store/courseEnrollmentSlice'
import learningItemReducer from '../../features/learning-item/store/learningItemSlice'
import classSessionReducer from '../../features/class-session/store/classSessionSlice'
import courseDetailReducer from '../../features/course-detail/store/courseDetailSlice'
import doCompetitionReducer from '../../features/do-competition/store/doCompetitionSlice'
import mediaReducer from '../../features/media/store/mediaSlice'
// Import your reducers here

export const store = configureStore({
  reducer: {
    // Add your reducers here
    auth: authReducer,
    notification: notificationReducer,
    profile: profileReducer,
    courseEnrollment: courseEnrollmentReducer,
    learningItem: learningItemReducer,
    classSession: classSessionReducer,
    courseDetail: courseDetailReducer,
    doCompetition: doCompetitionReducer,
    media: mediaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
