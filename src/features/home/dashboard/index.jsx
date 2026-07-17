import ContinueLearningSection from "./components/ContinueLearningSection";
import DashboardHomeworkSection from "./components/DashboardHomeworkSection";
import LatestLessonsSection from "./components/LatestLessonsSection";
import { useContinueLearningCourses } from "./hooks/useContinueLearningCourses";
import { useDashboardHomeworks } from "./hooks/useDashboardHomeworks";
import { useLatestLessons } from "./hooks/useLatestLessons";

export const DashboardPage = () => {
    const { enrollments, loading, error, openingCourseId, openCourse } = useContinueLearningCourses();
    const homeworks = useDashboardHomeworks();
    const latestLessons = useLatestLessons();

    return (
        <main className="w-full overflow-x-clip py-1.5 sm:py-3">
            <ContinueLearningSection
                enrollments={enrollments}
                loading={loading}
                error={error}
                openingCourseId={openingCourseId}
                onOpenCourse={openCourse}
            />
            <DashboardHomeworkSection
                status={homeworks.status}
                homeworks={homeworks.homeworks}
                pagination={homeworks.pagination}
                loading={homeworks.loading}
                error={homeworks.error}
                onChangeStatus={homeworks.changeStatus}
                onPreviousPage={homeworks.previousPage}
                onNextPage={homeworks.nextPage}
            />
            <LatestLessonsSection
                lessons={latestLessons.lessons}
                pagination={latestLessons.pagination}
                loading={latestLessons.loading}
                error={latestLessons.error}
                onPreviousPage={latestLessons.previousPage}
                onNextPage={latestLessons.nextPage}
            />
        </main>
    );
};

export default DashboardPage;
