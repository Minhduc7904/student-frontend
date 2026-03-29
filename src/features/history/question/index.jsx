import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    getPublicStudentQuestionAnswersAsync,
    selectPublicStudentQuestionAnswers,
    selectPublicStudentQuestionAnswersError,
    selectPublicStudentQuestionAnswersLoading,
} from "../../profile/store/profileSlice";
import QuestionHistoryList from "../components/QuestionHistoryList";
import { HISTORY_QUERY } from "../constants";

const QuestionHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectPublicStudentQuestionAnswers);
    const loading = useSelector(selectPublicStudentQuestionAnswersLoading);
    const error = useSelector(selectPublicStudentQuestionAnswersError);
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        dispatch(
            getPublicStudentQuestionAnswersAsync({
                ...HISTORY_QUERY,
                page,
                limit,
                ...(studentId ? { studentId } : {}),
            })
        );
    }, [dispatch, limit, page, studentId]);

    return (
        <QuestionHistoryList
            data={historyData}
            loading={loading}
            error={error}
            emptyText="Bạn chưa có lịch sử trả lời câu hỏi nào."
            onPageChange={setPage}
        />
    );
};

export default memo(QuestionHistoryPage);
