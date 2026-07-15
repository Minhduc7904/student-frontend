import { ClipboardList } from "lucide-react";
import { ContentLoading } from "../../../../shared/components";
import { HOMEWORK_TABS } from "../hooks/useDashboardHomeworks";
import DashboardHomeworkCard from "./DashboardHomeworkCard";
import DashboardPagination from "./DashboardPagination";

const DashboardHomeworkSection = ({ status, homeworks, pagination, loading, error, onChangeStatus, onPreviousPage, onNextPage }) => (
    <section className="mt-10 border-t border-blue-100 pt-8 sm:mt-12 sm:pt-10" aria-labelledby="my-homeworks-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Cần xử lý</p>
                <h2 id="my-homeworks-title" className="mt-1 text-2xl font-bold text-blue-950 sm:text-3xl">Bài tập của tôi</h2>
            </div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-blue-100 bg-white p-1" role="tablist" aria-label="Trạng thái bài tập">
                {HOMEWORK_TABS.map((tab) => <button key={tab.value} type="button" role="tab" aria-selected={status === tab.value} onClick={() => onChangeStatus(tab.value)} className={`shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm font-bold transition ${status === tab.value ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"}`}>{tab.label}</button>)}
            </div>
        </div>

        {loading ? <ContentLoading message="Đang tải bài tập..." height="py-20" /> : null}
        {!loading && error ? <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-sm font-medium text-red-600">{error}</div> : null}
        {!loading && !error && !homeworks.length ? (
            <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white px-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><ClipboardList size={24} /></span>
                <h3 className="mt-4 text-lg font-bold text-blue-950">Chưa có bài tập trong mục này</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">Bài tập của khóa học đang tham gia sẽ xuất hiện tại đây.</p>
            </div>
        ) : null}
        {!loading && !error && homeworks.length ? (
            <>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {homeworks.map((homework) => <DashboardHomeworkCard key={homework.learningItemId} homework={homework} />)}
                </div>
                <DashboardPagination pagination={pagination} onPrevious={onPreviousPage} onNext={onNextPage} label="bài tập" />
            </>
        ) : null}
    </section>
);

export default DashboardHomeworkSection;
