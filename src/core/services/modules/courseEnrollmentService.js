
import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants'

export const courseEnrollmentService = {
    getMyEnrollments: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.COURSE_ENROLLMENTS.MY, { params })
    }
};