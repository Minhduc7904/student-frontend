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
import competitionResultReducer from '../../features/competition/result/store/competitionResultSlice'
import tuitionPaymentReducer from '../../features/tuition-payment/store/tuitionPaymentSlice'
import competitionReducer from '../../features/competition/store/competitionSlice'
import competitionDetailReducer from '../../features/competition/competitionDetail/store/competitionDetailSlice'
import competitionExamReducer from '../../features/competition/exam/store/competitionExamSlice'
import competitionRankingReducer from '../../features/competition/ranking/store/competitionRankingSlice'
import competitionHistoryReducer from '../../features/competition/history/store/competitionHistorySlice'
import examsReducer from '../../features/exams/store/examsSlice'
import examDetailReducer from '../../features/exams/detail/store/examDetailSlice'
import practiceAttemptReducer from '../../features/exams/practice-attempt/store/practiceAttemptSlice'
import practiceResultReducer from '../../features/exams/practice-result/store/practiceResultSlice'
import competitionHistoryPageReducer from '../../features/history/competition/store/competitionHistoryPageSlice'
import examHistoryPageReducer from '../../features/history/exam/store/examHistoryPageSlice'
import questionHistoryPageReducer from '../../features/history/question/store/questionHistoryPageSlice'
import practiceByChapterReducer from '../../features/practice/by-chapter/store/practiceByChapterSlice'
import redoWrongReducer from '../../features/practice/redo-wrong/store/redoWrongSlice'
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
    competitionResult: competitionResultReducer,
    tuitionPayment: tuitionPaymentReducer,
    competition: competitionReducer,
    competitionDetail: competitionDetailReducer,
    competitionExam: competitionExamReducer,
    competitionRanking: competitionRankingReducer,
    competitionHistory: competitionHistoryReducer,
    exams: examsReducer,
    examDetail: examDetailReducer,
    practiceAttempt: practiceAttemptReducer,
    practiceResult: practiceResultReducer,
    competitionHistoryPage: competitionHistoryPageReducer,
    examHistoryPage: examHistoryPageReducer,
    questionHistoryPage: questionHistoryPageReducer,
    practiceByChapter: practiceByChapterReducer,
    redoWrong: redoWrongReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
