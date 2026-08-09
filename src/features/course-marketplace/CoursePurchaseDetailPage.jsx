import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ROUTES } from "../../core/constants";
import { courseService } from "../../core/services/modules/courseService";
import { addNotification } from "../notification/store/notificationSlice";
import { CourseHero } from "../course-detail/components/CourseHero";
import { CourseInfoPanel } from "../course-detail/components/CourseInfoPanel";
import { CourseLearningProgram } from "../course-detail/components/CourseLearningProgram";
import { CourseMediaGallery } from "../course-detail/components/CourseMediaGallery";
import { getCourseBanner, getCourseImage, getCourseSummary } from "../course-detail/components/courseDetailUtils";
import { selectChapters } from "../course-detail/store/courseDetailSlice";

const unwrap = (response) => response?.data?.data ?? response?.data ?? response ?? {};

const CoursePurchaseDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId: routeCourseId } = useParams();
    const chapters = useSelector(selectChapters);
    const outletContext = useOutletContext() || {};
    const {
        courseId = routeCourseId,
        courseDetail,
        lessons = [],
        lessonsLoading,
        lessonsError,
    } = outletContext;
    const [isPreparingPayment, setIsPreparingPayment] = useState(false);

    const summary = useMemo(() => getCourseSummary({ courseDetail, chapters, lessons }), [chapters, courseDetail, lessons]);
    const courseImage = getCourseImage(courseDetail);
    const bannerSrc = getCourseBanner(courseDetail);

    const startPurchase = async () => {
        if (!courseDetail || isPreparingPayment) return;

        setIsPreparingPayment(true);
        try {
            const courseReference = courseDetail.code || courseDetail.courseId || courseId;
            const response = await courseService.getCoursePaymentInstructions(courseReference);
            const instructions = unwrap(response);

            if (["FREE", "ACTIVE"].includes(String(instructions?.status || "").toUpperCase())) {
                navigate(ROUTES.COURSE_DETAIL(courseId), { replace: true, state: { resetAll: true } });
                return;
            }

            if (!instructions?.paymentIntentId || String(instructions?.status || "").toUpperCase() !== "PENDING") {
                throw new Error("Phiên thanh toán chưa sẵn sàng. Vui lòng thử lại sau.");
            }

            navigate(ROUTES.COURSE_PAYMENT_INTENT(courseId, instructions.paymentIntentId), {
                state: {
                    instructions,
                    courseReference,
                    courseTitle: courseDetail.title,
                },
            });
        } catch (requestError) {
            dispatch(addNotification({
                type: "error",
                title: "Không thể tạo thanh toán",
                message: requestError?.message || "Vui lòng thử lại sau.",
                autoHide: true,
            }));
        } finally {
            setIsPreparingPayment(false);
        }
    };

    const scrollToLessons = () => {
        document.getElementById("course-lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const purchaseAction = { Icon: ShoppingCart, label: isPreparingPayment ? "Đang chuẩn bị thanh toán..." : "Mua khóa học", onClick: startPurchase, disabled: isPreparingPayment };

    return (
        <main className="min-h-[calc(100dvh-80px)] overflow-x-clip bg-blue-50 text-blue-950">
            <CourseHero
                course={courseDetail}
                courseId={courseId}
                bannerSrc={bannerSrc}
                summary={summary}
                isEnrolled={false}
                primaryAction={purchaseAction}
                onViewRoadmap={scrollToLessons}
                backRoute={ROUTES.COURSE_MARKETPLACE}
                backLabel="Mua khóa học"
            />

            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:py-10">
                <section id="course-roadmap" className="order-2 min-w-0 lg:order-1">
                    <div className="mb-5 max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Lộ trình khóa học</p>
                        <h2 className="mt-2 text-2xl font-bold text-blue-950 sm:text-3xl">Xem trước toàn bộ nội dung khóa học</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Bạn có thể xem cấu trúc khóa học trước khi mua. Nội dung từng bài sẽ được mở sau khi thanh toán thành công.</p>
                    </div>
                    <CourseMediaGallery course={courseDetail} />
                    <div id="course-lessons" className="scroll-mt-6">
                        <CourseLearningProgram chapters={chapters} loading={lessonsLoading} error={lessonsError} courseImage={courseImage} previewOnly />
                    </div>
                </section>

                <CourseInfoPanel course={courseDetail} courseImage={courseImage} totalLessons={summary.totalLessons} isEnrolled={false} showPrice primaryAction={purchaseAction} />
            </div>
        </main>
    );
};

export default CoursePurchaseDetailPage;
