import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
    getPublicStudentExamAttemptsAsync,
    selectPublicStudentExamAttempts,
    selectPublicStudentExamAttemptsLoading,
} from "../../profile/store/profileSlice";
import HistoryListView from "../components/HistoryListView";
import { HISTORY_QUERY, HISTORY_TYPES } from "../constants";

const ExamHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { isOtherStudentHistory = false } = useOutletContext() || {};
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectPublicStudentExamAttempts);
    const loading = useSelector(selectPublicStudentExamAttemptsLoading);

    useEffect(() => {
        dispatch(
            getPublicStudentExamAttemptsAsync({
                ...HISTORY_QUERY,
                ...(studentId ? { studentId } : {}),
            })
        );
    }, [dispatch, studentId]);

    return (
        <HistoryListView
            data={historyData}
            loading={loading}
            type={HISTORY_TYPES.EXAM}
            isOtherStudentHistory={isOtherStudentHistory}
            emptyText="Bạn chưa có lịch sử làm đề mẫu nào."
        />
    );
};

export default memo(ExamHistoryPage);
