

import { BookOpen } from "lucide-react";
import { CourseList, CourseModeTabs } from "./components";

export const EnrollmentsPage = () => {
    return (
        <main className="w-full text-blue-950">
            <CourseModeTabs />
            <header className="mb-7 mt-7 flex items-start gap-3 sm:mb-8 sm:mt-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm">
                    <BookOpen size={21} />
                </span>
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Khóa học của tôi</h1>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Chọn khóa học để xem lộ trình và tiếp tục bài đang học.
                    </p>
                </div>
            </header>
            <CourseList />
        </main>
    );
};

export default EnrollmentsPage;
