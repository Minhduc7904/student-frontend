import { memo, Suspense } from "react";
import { Outlet } from "react-router-dom";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
import { ContentLoading } from "../../../shared/components/loading";

const CoursesLayout = () => (
    <AuthenticatedLayout>
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#FDFDFD] custom-scrollbar">
            <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-4 md:px-6 md:pt-6 xl:px-8 xl:pt-8">
                <Suspense fallback={<ContentLoading />}>
                    <Outlet />
                </Suspense>
            </div>
        </main>
    </AuthenticatedLayout>
);

export default memo(CoursesLayout);
