import { Suspense, memo } from "react";
import { Outlet } from "react-router-dom";
import { RightSidebar } from "./components";
import { ContentLoading } from "../../../shared/components/loading";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";

/**
 * Home Layout
 * - Sidebar cố định
 * - Header cố định
 * - Content scroll độc lập
 */
const HomeLayout = () => {
    return (
        <AuthenticatedLayout>
            {/* Home Layout Content */}
            <div className="relative flex-1 flex flex-col lg:flex-row h-full bg-[#FDFDFD] overflow-y-auto overflow-x-hidden lg:overflow-hidden custom-scrollbar">
                {/* Right Sidebar - Hiển thị trên cùng trên mobile, bên phải trên desktop */}
                <div className="order-first hidden md:block lg:order-last">
                    <RightSidebar />
                </div>

                {/* Page content */}
                <main className="relative z-10 flex-1 px-4 xl:px-6 2xl:px-15 pt-4 md:pt-4 lg:pt-10 lg:overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="w-full max-w-7xl mx-auto">
                        <Suspense fallback={<ContentLoading />}>
                            <Outlet />
                        </Suspense>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default memo(HomeLayout);
