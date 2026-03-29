import { Suspense, memo } from "react";
import { Outlet } from "react-router-dom";
import { ContentLoading } from "../../../shared/components/loading";
import BackgroundCompetition from "../../../assets/images/BackgroundCompetition.png";
import AuthenticatedLayout from "../../../shared/components/layout/AuthenticatedLayout";
/**
 * CompetitionLayout
 * Layout riêng cho Competition, giữ hành vi giống PracticeLayout.
 */
const CompetitionLayout = () => {
    return (
        <AuthenticatedLayout>
            <div className="relative flex-1 flex flex-col lg:flex-row h-full overflow-y-auto overflow-x-hidden lg:overflow-hidden custom-scrollbar">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={BackgroundCompetition}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="pointer-events-none absolute inset-0 z-1 bg-slate-900/5" />

                <main className="relative z-10 flex-1 flex items-center flex-col px-4 xl:px-6 2xl:px-15 py-4 pt-4 md:pt-4 lg:pt-10 lg:overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="w-full max-w-7xl flex items-center justify-center mb-6">
                        <Suspense fallback={<ContentLoading />}>
                            <Outlet />
                        </Suspense>
                    </div>

                    <footer className="mt-auto w-auto self-stretch -mx-4 xl:-mx-6 2xl:-mx-15 border-t border-slate-300 bg-white py-4 text-center text-sm text-slate-600">
                        Developed by{' '}
                        <a
                            href="https://www.facebook.com/nm.duc7904"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sky-700 underline underline-offset-4 transition-colors hover:text-sky-600"
                        >
                            Nguyễn Minh Đức
                        </a>
                    </footer>
                </main>
            </div>
        </AuthenticatedLayout>
    );
};

export default memo(CompetitionLayout);
