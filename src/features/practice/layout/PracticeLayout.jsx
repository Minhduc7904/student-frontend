import { Suspense, memo, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import { AppBreadcrumb } from "../../../shared/components";
import { ContentLoading } from "../../../shared/components/loading";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";

/**
 * PracticeLayout
 * Layout riêng cho Practice, giữ hành vi giống HomeLayout
 * nhưng sử dụng RightSidebar custom của module Practice.
 */
const PracticeLayout = () => {
    const location = useLocation();

    const breadcrumbItems = useMemo(() => {
        const pathname = location.pathname || "";

        if (pathname.startsWith(ROUTES.PRACTICE_BY_CHAPTER)) {
            return [
                { label: "Luyện tập", to: ROUTES.PRACTICE },
                { label: "Luyện theo chương" },
            ];
        }

        return [{ label: "Luyện tập" }];
    }, [location.pathname]);

    return (
        <AuthenticatedLayout>
            <main className="relative z-10 flex-1 bg-[#F7F8FA] flex items-center flex-col px-4 xl:px-6 2xl:px-15 py-4 pt-4 md:pt-4 lg:pt-10 lg:overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="w-full max-w-7xl mb-6">
                    <AppBreadcrumb items={breadcrumbItems} />

                    <Suspense fallback={<ContentLoading />}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </AuthenticatedLayout>
    );
};

export default memo(PracticeLayout);
