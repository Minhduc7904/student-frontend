import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
    getPublicStudentQuestionAnswersAsync,
    selectPublicStudentQuestionAnswers,
    selectPublicStudentQuestionAnswersLoading,
} from "../../profile/store/profileSlice";
import HistoryListView from "../components/HistoryListView";
import { HISTORY_QUERY, HISTORY_TYPES } from "../constants";

const QuestionHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { isOtherStudentHistory = false } = useOutletContext() || {};
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectPublicStudentQuestionAnswers);
    const loading = useSelector(selectPublicStudentQuestionAnswersLoading);

    useEffect(() => {
        dispatch(
            getPublicStudentQuestionAnswersAsync({
                ...HISTORY_QUERY,
                ...(studentId ? { studentId } : {}),
            })
        );
    }, [dispatch, studentId]);

    return (
        <HistoryListView
            data={historyData}
            loading={loading}
            type={HISTORY_TYPES.QUESTION}
            isOtherStudentHistory={isOtherStudentHistory}
            emptyText="Bạn chưa có lịch sử trả lời câu hỏi nào."
        />
    );
};

export default memo(QuestionHistoryPage);
