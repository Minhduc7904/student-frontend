import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import {
    getQuestionHistoryPageAsync,
    getQuestionHistoryStatisticsAsync,
    selectQuestionHistoryPageData,
    selectQuestionHistoryPageError,
    selectQuestionHistoryPageLoading,
    selectQuestionHistoryPagePagination,
} from "./store/questionHistoryPageSlice";
import QuestionHistoryList from "../components/QuestionHistoryList";
import { HISTORY_QUERY } from "../constants";

const QuestionHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectQuestionHistoryPageData);
    const pagination = useSelector(selectQuestionHistoryPagePagination);
    const loading = useSelector(selectQuestionHistoryPageLoading);
    const error = useSelector(selectQuestionHistoryPageError);
    const [page, setPage] = useState(1);
    const limit = 20;

    const buildQuery = () => ({
        ...HISTORY_QUERY,
        page,
        limit,
        ...(studentId ? { studentId } : {}),
    });

    useEffect(() => {
        const query = buildQuery();
        dispatch(getQuestionHistoryPageAsync(query));
    }, [dispatch, limit, page, studentId]);

    useEffect(() => {
        dispatch(getQuestionHistoryStatisticsAsync({ studentId }));
    }, [dispatch, studentId]);

    const handleReload = () => {
        const query = buildQuery();
        dispatch(getQuestionHistoryPageAsync(query));
        dispatch(getQuestionHistoryStatisticsAsync({ studentId }));
    };

    return (
        <section>
            <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleReload}
                        disabled={loading}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-text-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Reload
                    </button>
                </div>
            </div>

            <QuestionHistoryList
                data={historyData}
                pagination={pagination}
                loading={loading}
                error={error}
                emptyText="Bạn chưa có lịch sử trả lời câu hỏi nào."
                onPageChange={setPage}
            />
        </section>
    );
};

export default memo(QuestionHistoryPage);
