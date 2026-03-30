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
    const [sortBy, setSortBy] = useState("submittedAt");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        dispatch(
            getPublicStudentExamAttemptsAsync({
                ...HISTORY_QUERY,
                page,
                limit,
                sortBy,
                sortOrder,
                ...(studentId ? { studentId } : {}),
            })
        );
    }, [dispatch, limit, page, sortBy, sortOrder, studentId]);

    const handleSortChange = (field) => {
        setPage(1);
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }

        setSortBy(field);
        setSortOrder("desc");
    };

    return (
        <ExamHistoryList
            data={historyData}
            loading={loading}
            error={error}
            emptyText="Bạn chưa có lịch sử làm đề mẫu nào."
            onPageChange={setPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
        />
    );
};

export default memo(ExamHistoryPage);
