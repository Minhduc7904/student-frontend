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
            <div className="flex-1 flex flex-col lg:flex-row h-full bg-white overflow-y-auto lg:overflow-hidden custom-scrollbar">
                {/* Right Sidebar - custom cho Practice */}
                <div className="order-first lg:order-last">
                    <PracticeRightSidebar />
                </div>

                {/* Page content */}
                <main className="flex-1 px-4 xl:px-6 2xl:px-15 pt-10 lg:overflow-y-auto custom-scrollbar">
                    <Suspense fallback={<ContentLoading />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default memo(PracticeLayout);
