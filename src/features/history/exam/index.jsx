import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import {
    getExamHistoryPageAsync,
    selectExamHistoryPageData,
    selectExamHistoryPageError,
    selectExamHistoryPageLoading,
    selectExamHistoryPagePagination,
} from "./store/examHistoryPageSlice";
import ExamHistoryList from "../components/ExamHistoryList";
import { HISTORY_QUERY } from "../constants";

const ExamHistoryPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get("studentId") || undefined;
    const historyData = useSelector(selectExamHistoryPageData);
    const pagination = useSelector(selectExamHistoryPagePagination);
    const loading = useSelector(selectExamHistoryPageLoading);
    const error = useSelector(selectExamHistoryPageError);
    const [page, setPage] = useState(1);
    const limit = 20;
    const [sortBy, setSortBy] = useState("submittedAt");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        dispatch(
            getExamHistoryPageAsync({
                ...HISTORY_QUERY,
                page,
                limit,
                sortBy,
                sortOrder,
                ...(studentId ? { studentId } : {}),
            })
        );
    }, [dispatch, limit, page, sortBy, sortOrder, studentId]);

    const handleReload = () => {
        dispatch(
            getExamHistoryPageAsync({
                ...HISTORY_QUERY,
                page,
                limit,
                sortBy,
                sortOrder,
                ...(studentId ? { studentId } : {}),
            })
        );
    };

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

            <ExamHistoryList
                data={historyData}
                pagination={pagination}
                loading={loading}
                error={error}
                emptyText="Bạn chưa có lịch sử làm đề mẫu nào."
                onPageChange={setPage}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
        </section>
    );
};

export default memo(ExamHistoryPage);
