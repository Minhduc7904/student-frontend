import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    getPublicStudentExamAttemptsAsync,
    selectPublicStudentExamAttempts,
    selectPublicStudentExamAttemptsError,
    selectPublicStudentExamAttemptsLoading,
} from "../../profile/store/profileSlice";
import ExamHistoryList from "../components/ExamHistoryList";
import { HISTORY_QUERY } from "../constants";

const ExamHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectPublicStudentExamAttempts);
    const loading = useSelector(selectPublicStudentExamAttemptsLoading);
    const error = useSelector(selectPublicStudentExamAttemptsError);
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        dispatch(
            getPublicStudentExamAttemptsAsync({
                ...HISTORY_QUERY,
                page,
                limit,
                ...(studentId ? { studentId } : {}),
            })
        );
    }, [dispatch, limit, page, studentId]);

    return (
        <ExamHistoryList
            data={historyData}
            loading={loading}
            error={error}
            emptyText="Bạn chưa có lịch sử làm đề mẫu nào."
            onPageChange={setPage}
        />
    );
};

export default memo(ExamHistoryPage);
