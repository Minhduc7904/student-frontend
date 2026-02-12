
import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants'

export const learningItemService = {
    getMyHomeworks: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.LEARNING_ITEMS.MY_HOMEWORKS, { params })
    }
};