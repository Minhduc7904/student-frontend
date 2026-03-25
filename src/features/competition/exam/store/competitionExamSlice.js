import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { competitionService } from '../../../../core/services/modules/competitionService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const initialState = {
    examInfo: null,
    sections: [],
    questions: [],
    sectionQuestions: {},
    sectionsWithQuestions: [],
    otherSection: null,
    totalQuestions: 0,
    loading: false,
    error: null,
};

const sortByOrderAsc = (items = []) => {
    return [...items].sort((a, b) => {
        const aOrder = a?.order;
        const bOrder = b?.order;

        if (aOrder == null && bOrder == null) return 0;
        if (aOrder == null) return 1;
        if (bOrder == null) return -1;

        return Number(aOrder) - Number(bOrder);
    });
};

const normalizeExamPayload = (examPayload) => {
    if (!examPayload) {
        return {
            examInfo: null,
            sections: [],
            questions: [],
            sectionQuestions: {},
            sectionsWithQuestions: [],
            otherSection: null,
            totalQuestions: 0,
        };
    }

    const { sections: rawSections = [], questions: rawQuestions = [], ...examInfo } = examPayload;

    const sections = sortByOrderAsc(Array.isArray(rawSections) ? rawSections : []);
    const questions = sortByOrderAsc(Array.isArray(rawQuestions) ? rawQuestions : []);

    const sectionQuestions = sections.reduce((acc, section) => {
        const key = String(section?.sectionId);
        acc[key] = [];
        return acc;
    }, {});

    const otherQuestions = [];

    questions.forEach((question) => {
        const key = question?.sectionId == null ? null : String(question.sectionId);

        if (key && Object.prototype.hasOwnProperty.call(sectionQuestions, key)) {
            sectionQuestions[key].push(question);
            return;
        }

        otherQuestions.push(question);
    });

    const sectionsWithQuestions = sections.map((section) => {
        const key = String(section?.sectionId);

        return {
            ...section,
            questions: sectionQuestions[key] ?? [],
        };
    });

    const otherSection = otherQuestions.length
        ? {
            sectionId: 'other',
            title: 'Khác',
            description: null,
            processedDescription: null,
            order: sections.length + 1,
            isSystemSection: true,
            questions: otherQuestions,
        }
        : null;

    if (otherSection) {
        sectionsWithQuestions.push(otherSection);
    }

    return {
        examInfo,
        sections,
        questions,
        sectionQuestions,
        sectionsWithQuestions,
        otherSection,
        totalQuestions: questions.length,
    };
};

/**
 * Fetch public exam content by competition for current student.
 * API: GET /competitions/:id/student/exam
 */
export const fetchCompetitionExam = createAsyncThunk(
    'competitionExam/fetchCompetitionExam',
    async (competitionId, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentCompetitionExam(competitionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay noi dung de thi cuoc thi that bai',
            }
        );
    }
);

const competitionExamSlice = createSlice({
    name: 'competitionExam',
    initialState,
    reducers: {
        clearCompetitionExam: (state) => {
            state.examInfo = null;
            state.sections = [];
            state.questions = [];
            state.sectionQuestions = {};
            state.sectionsWithQuestions = [];
            state.otherSection = null;
            state.totalQuestions = 0;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitionExam.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.examInfo = null;
                state.sections = [];
                state.questions = [];
                state.sectionQuestions = {};
                state.sectionsWithQuestions = [];
                state.otherSection = null;
                state.totalQuestions = 0;
            })
            .addCase(fetchCompetitionExam.fulfilled, (state, action) => {
                const normalized = normalizeExamPayload(action.payload?.data ?? null);

                state.loading = false;
                state.error = null;
                state.examInfo = normalized.examInfo;
                state.sections = normalized.sections;
                state.questions = normalized.questions;
                state.sectionQuestions = normalized.sectionQuestions;
                state.sectionsWithQuestions = normalized.sectionsWithQuestions;
                state.otherSection = normalized.otherSection;
                state.totalQuestions = normalized.totalQuestions;
            })
            .addCase(fetchCompetitionExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.examInfo = null;
                state.sections = [];
                state.questions = [];
                state.sectionQuestions = {};
                state.sectionsWithQuestions = [];
                state.otherSection = null;
                state.totalQuestions = 0;
            });
    },
});

export const { clearCompetitionExam } = competitionExamSlice.actions;

export const selectCompetitionExamInfo = (state) => state.competitionExam.examInfo;
export const selectCompetitionExamSections = (state) => state.competitionExam.sections;
export const selectCompetitionExamQuestions = (state) => state.competitionExam.questions;
export const selectCompetitionExamSectionQuestions = (state) => state.competitionExam.sectionQuestions;
export const selectCompetitionExamSectionsWithQuestions = (state) => state.competitionExam.sectionsWithQuestions;
export const selectCompetitionExamOtherSection = (state) => state.competitionExam.otherSection;
export const selectCompetitionExamTotalQuestions = (state) => state.competitionExam.totalQuestions;
export const selectCompetitionExamLoading = (state) => state.competitionExam.loading;
export const selectCompetitionExamError = (state) => state.competitionExam.error;

// Backward-compatible combined selector.
export const selectCompetitionExamData = (state) => {
    const examInfo = state.competitionExam.examInfo;

    if (!examInfo) return null;

    return {
        ...examInfo,
        sections: state.competitionExam.sections,
        questions: state.competitionExam.questions,
    };
};

export default competitionExamSlice.reducer;
