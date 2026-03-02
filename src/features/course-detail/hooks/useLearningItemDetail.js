import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    fetchLearningItemDetail,
    selectLearningItemDetail,
    selectLearningItemDetailLoading,
    selectLearningItemDetailError,
    clearLearningItemDetail,
} from "../store/courseDetailSlice";

/**
 * Custom hook for Learning Item Detail logic
 * Quản lý logic fetch learning item detail
 */
export const useLearningItemDetail = () => {
    const dispatch = useDispatch();
    const { learningItemId } = useParams();

    // Selectors
    const learningItemDetail = useSelector(selectLearningItemDetail);
    const loading = useSelector(selectLearningItemDetailLoading);
    const error = useSelector(selectLearningItemDetailError);

    // Fetch learning item detail khi learningItemId thay đổi
    useEffect(() => {
        if (learningItemId && learningItemId != learningItemDetail?.learningItemId) {
            dispatch(fetchLearningItemDetail(learningItemId));
        }
    }, [dispatch, learningItemId]);

    return {
        learningItemId,
        learningItemDetail,
        loading,
        error,
    };
};
