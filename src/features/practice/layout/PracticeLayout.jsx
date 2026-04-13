import { Suspense, memo } from "react";
import { Outlet } from "react-router-dom";
import PracticeRightSidebar from "../component/RightSidebar";
import { ContentLoading } from "../../../shared/components/loading";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";

/**
 * PracticeLayout
 * Layout riêng cho Practice, giữ hành vi giống HomeLayout
 * nhưng sử dụng RightSidebar custom của module Practice.
 */
const PracticeLayout = () => {
    return (
        <AuthenticatedLayout>
            <main className="relative z-10 flex-1 bg-[#F7F8FA] flex items-center flex-col px-4 xl:px-6 2xl:px-15 py-4 pt-4 md:pt-4 lg:pt-10 lg:overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="w-full max-w-7xl flex items-center justify-center mb-6">
                    <Suspense fallback={<ContentLoading />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </AuthenticatedLayout>
    );
};

export default memo(PracticeLayout);
