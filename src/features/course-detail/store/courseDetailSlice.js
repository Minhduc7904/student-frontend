import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../../../core/services/modules/courseService';
import { lessonService } from '../../../core/services/modules/lessonService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

/**
 * Initial State
 */
const initialState = {
    courseDetail: null,
    loading: false,
    error: null,
    lessons: [],
    lessonsLoading: false,
    lessonsError: null,
    chapters: [],
    lessonDetail: null,
    lessonDetailLoading: false,
    lessonDetailError: null,
};

/**
 * Async Thunks
 */

/**
 * Fetch student course detail by ID
 */
export const fetchStudentCourseDetail = createAsyncThunk(
    'courseDetail/fetchStudentCourseDetail',
    async (courseId, thunkAPI) => {
        return handleAsyncThunk(
            () => courseService.getStudentCourseDetail(courseId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy thông tin khóa học thất bại',
            }
        );
    }
);

/**
 * Fetch lessons for a course
 */
export const fetchCourseLessons = createAsyncThunk(
    'courseDetail/fetchCourseLessons',
    async (courseId, thunkAPI) => {
        return handleAsyncThunk(
            () => lessonService.getCourseLessons(courseId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách bài học thất bại',
            }
        );
    }
);

/**
 * Fetch lesson detail by ID
 */
export const fetchLessonDetail = createAsyncThunk(
    'courseDetail/fetchLessonDetail',
    async (lessonId, thunkAPI) => {
        return handleAsyncThunk(
            () => lessonService.getLessonDetail(lessonId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy thông tin bài học thất bại',
            }
        );
    }
);


/**
 * Course Detail Slice
 */
const courseDetailSlice = createSlice({
    name: 'courseDetail',
    initialState,
    reducers: {
        clearCourseDetail: (state) => {
            state.courseDetail = null;
            state.error = null;
        },
        setCourseDetail: (state, action) => {
            state.courseDetail = action.payload;
        },
        clearLessons: (state) => {
            state.lessons = [];
            state.lessonsError = null;
        },
        clearChapters: (state) => {
            state.chapters = [];
        },
        clearLessonDetail: (state) => {
            state.lessonDetail = null;
            state.lessonDetailError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Student Course Detail
            .addCase(fetchStudentCourseDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.courseDetail = null;
            })
            .addCase(fetchStudentCourseDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.courseDetail = action.payload.data;
            })
            .addCase(fetchStudentCourseDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.courseDetail = null;
            })
            // Fetch Course Lessons
            .addCase(fetchCourseLessons.pending, (state) => {
                state.lessonsLoading = true;
                state.lessonsError = null;
            })
            .addCase(fetchCourseLessons.fulfilled, (state, action) => {
                state.lessonsLoading = false;
                const lessons = action.payload.data;
                state.lessons = lessons;

                // Group lessons by chapters
                const chapterMap = new Map();
                const unclassifiedLessons = [];

                lessons.forEach((lesson) => {
                    // Kiểm tra lesson có chapters không
                    if (!lesson.chapters || lesson.chapters.length === 0) {
                        // Lesson không có chapter -> đưa vào danh sách unclassified
                        unclassifiedLessons.push(lesson);
                    } else {
                        // Lesson có nhiều chapters, thêm lesson vào tất cả các chapters
                        lesson.chapters.forEach((chapter) => {
                            const chapterId = chapter.chapterId;

                            if (!chapterMap.has(chapterId)) {
                                chapterMap.set(chapterId, {
                                    ...chapter,
                                    lessons: [],
                                });
                            }

                            chapterMap.get(chapterId).lessons.push(lesson);
                        });
                    }
                });

                // Chuyển Map thành array, tính completionPercentage và sort theo orderInParent
                const groupedChapters = Array.from(chapterMap.values()).map((chapter) => {
                    // Tính completionPercentage trung bình của tất cả lessons trong chapter
                    const totalLessons = chapter.lessons.length;
                    const totalCompletion = chapter.lessons.reduce(
                        (sum, lesson) => sum + (lesson.completionPercentage || 0),
                        0
                    );
                    const completionPercentage = totalLessons > 0 
                        ? Math.round(totalCompletion / totalLessons) 
                        : 0;

                    return {
                        ...chapter,
                        completionPercentage,
                    };
                }).sort(
                    (a, b) => (a.orderInParent || 0) - (b.orderInParent || 0)
                );

                // Thêm chapter "Khác" nếu có lessons chưa phân loại
                if (unclassifiedLessons.length > 0) {
                    // Tính completionPercentage cho chapter "Khác"
                    const totalLessons = unclassifiedLessons.length;
                    const totalCompletion = unclassifiedLessons.reduce(
                        (sum, lesson) => sum + (lesson.completionPercentage || 0),
                        0
                    );
                    const completionPercentage = totalLessons > 0 
                        ? Math.round(totalCompletion / totalLessons) 
                        : 0;

                    groupedChapters.push({
                        chapterId: 'unclassified',
                        name: 'Khác',
                        code: 'khac',
                        slug: 'khac',
                        level: 999,
                        orderInParent: 999,
                        lessons: unclassifiedLessons,
                        completionPercentage,
                    });
                }

                state.chapters = groupedChapters;
            })
            .addCase(fetchCourseLessons.rejected, (state, action) => {
                state.lessonsLoading = false;
                state.lessonsError = action.payload || action.error.message;
                state.lessons = [];
                state.chapters = [];
            })
            // Fetch Lesson Detail
            .addCase(fetchLessonDetail.pending, (state) => {
                state.lessonDetailLoading = true;
                state.lessonDetailError = null;
            })
            .addCase(fetchLessonDetail.fulfilled, (state, action) => {
                state.lessonDetailLoading = false;
                state.lessonDetail = action.payload.data;
            })
            .addCase(fetchLessonDetail.rejected, (state, action) => {
                state.lessonDetailLoading = false;
                state.lessonDetailError = action.payload || action.error.message;
                state.lessonDetail = null;
            });
    },
});

/**
 * Actions
 */
export const {
    clearCourseDetail,
    setCourseDetail,
    clearLessons,
    clearChapters,
    clearLessonDetail,
} = courseDetailSlice.actions;

/**
 * Selectors
 */
export const selectCourseDetail = (state) => state.courseDetail.courseDetail;
export const selectCourseDetailLoading = (state) => state.courseDetail.loading;
export const selectCourseDetailError = (state) => state.courseDetail.error;
export const selectCourseLessons = (state) => state.courseDetail.lessons;
export const selectCourseLessonsLoading = (state) => state.courseDetail.lessonsLoading;
export const selectCourseLessonsError = (state) => state.courseDetail.lessonsError;
export const selectChapters = (state) => state.courseDetail.chapters;
export const selectLessonDetail = (state) => state.courseDetail.lessonDetail;
export const selectLessonDetailLoading = (state) => state.courseDetail.lessonDetailLoading;
export const selectLessonDetailError = (state) => state.courseDetail.lessonDetailError;

export default courseDetailSlice.reducer;
