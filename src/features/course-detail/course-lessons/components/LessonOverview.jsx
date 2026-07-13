import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import {
    getItemMeta,
    getItemTitle,
    getLessonProgress,
    shellMotion,
} from "./learningPageUtils";

export const LessonOverview = ({ lessonDetail, onOpenItem }) => {
    const learningItems = lessonDetail?.learningItems || [];
    const progress = getLessonProgress(lessonDetail);

    if (!lessonDetail) {
        return (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
                <div>
                    <BookOpen className="mx-auto text-blue-200" size={36} />
                    <p className="mt-3 text-sm font-bold text-blue-950">Chọn một bài học ở bên trái</p>
                    <p className="mt-1 text-xs text-gray-600">Nội dung bài học sẽ hiển thị tại đây.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Bài học</p>
                        <h1 className="mt-1 text-xl font-bold leading-tight text-blue-950 sm:text-2xl">
                            {lessonDetail.title || "Bài học"}
                        </h1>
                        {lessonDetail.teacherName ? (
                            <p className="mt-2 text-sm text-gray-600">Giáo viên: {lessonDetail.teacherName}</p>
                        ) : null}
                    </div>
                    <div className="w-full shrink-0 rounded-xl bg-white p-3 sm:w-48">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Tiến độ</span>
                            <span className="font-bold tabular-nums text-blue-950">{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                            <div className="h-full rounded-full bg-blue-800" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-gray-500">Mục học tập</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-blue-950">
                        {lessonDetail.totalLearningItems ?? learningItems.length}
                    </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-gray-500">Đã hoàn thành</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-blue-950">
                        {lessonDetail.completedLearningItems ?? learningItems.filter((item) => item?.isLearned).length}
                    </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-gray-500">Chương liên quan</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-blue-950">
                        {lessonDetail.chapters?.length || 0}
                    </p>
                </div>
            </div>

            <section className="rounded-2xl border border-blue-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-blue-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-blue-950">Nội dung học tập</h2>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {learningItems.length} mục
                    </span>
                </div>

                {learningItems.length ? (
                    <div className="divide-y divide-blue-100">
                        {learningItems.map((item, index) => {
                            const meta = getItemMeta(item.type);
                            const Icon = meta.icon;

                            return (
                                <button
                                    type="button"
                                    key={item.learningItemId}
                                    onClick={() => onOpenItem(item)}
                                    className={`group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left ${shellMotion} hover:bg-blue-50/70 active:scale-[0.995]`}
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-xs font-bold tabular-nums text-blue-700">
                                        {index + 1}
                                    </span>
                                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta.className}`}>
                                        <Icon size={17} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-bold text-blue-950">
                                            {getItemTitle(item)}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-gray-500">{meta.label}</span>
                                    </span>
                                    {item.isLearned ? (
                                        <CheckCircle2 size={18} className="shrink-0 text-green-600" />
                                    ) : (
                                        <ArrowRight size={17} className="shrink-0 text-blue-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-800" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-sm text-gray-600">
                        Bài học này chưa có mục học tập.
                    </div>
                )}
            </section>
        </div>
    );
};
