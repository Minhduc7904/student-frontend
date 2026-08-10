import { API_ENDPOINTS } from '../../constants';
import { axiosClient } from '../client';

export const bookService = {
    getStudentBooks: (params = {}) => axiosClient.get(API_ENDPOINTS.BOOKS.STUDENT_MY, {
        params,
        paramsSerializer: { indexes: null },
    }),
    getStudentBookCategories: () => axiosClient.get(API_ENDPOINTS.BOOKS.STUDENT_CATEGORIES),
    getStudentBookDetail: (slug) => axiosClient.get(API_ENDPOINTS.BOOKS.STUDENT_DETAIL(slug)),
    trackStudentBookView: (slug) => axiosClient.post(API_ENDPOINTS.BOOKS.STUDENT_TRACK_VIEW(slug)),
};
