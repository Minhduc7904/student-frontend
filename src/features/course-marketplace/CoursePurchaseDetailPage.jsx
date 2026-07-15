import { useCallback, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ROUTES, enrollmentStatus } from "../../core/constants";
import { courseService } from "../../core/services/modules/courseService";
import { addNotification } from "../notification/store/notificationSlice";
import { fetchMyEnrollments } from "../course-enrollment/store/courseEnrollmentSlice";
import { selectMyProfile } from "../profile/store/profileSlice";
import { CourseHero } from "../course-detail/components/CourseHero";
import { CourseInfoPanel } from "../course-detail/components/CourseInfoPanel";
import { CourseLearningProgram } from "../course-detail/components/CourseLearningProgram";
import { CourseMediaGallery } from "../course-detail/components/CourseMediaGallery";
import { getCourseBanner, getCourseImage, getCourseSummary } from "../course-detail/components/courseDetailUtils";
import { selectChapters } from "../course-detail/store/courseDetailSlice";
import PurchasePaymentModal from "./components/PurchasePaymentModal";
import { useInvoicePaymentStatus } from "./hooks/useInvoicePaymentStatus";
import { getInvoiceDetails } from "./paymentUtils";

const CoursePurchaseDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId: routeCourseId } = useParams();
    const profile = useSelector(selectMyProfile);
    const chapters = useSelector(selectChapters);
    const outletContext = useOutletContext() || {};
    const {
        courseId = routeCourseId,
        courseDetail,
        lessons = [],
        lessonsLoading,
        lessonsError,
    } = outletContext;
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
    const [payment, setPayment] = useState(null);

    const summary = useMemo(() => getCourseSummary({ courseDetail, chapters, lessons }), [chapters, courseDetail, lessons]);
    const courseImage = getCourseImage(courseDetail);
    const bannerSrc = getCourseBanner(courseDetail);

    const finishPurchase = useCallback(async () => {
        setPayment((current) => current ? { ...current, status: "PAID" } : current);

        await Promise.allSettled([
            dispatch(fetchMyEnrollments({ status: enrollmentStatus.ACTIVE, page: 1, limit: 6 })).unwrap(),
            courseService.getStudentOnlineCoursesNotEnrolled({ page: 1, limit: 12 }),
            courseService.getStudentCourseDetail(courseId),
        ]);

        window.setTimeout(() => {
            navigate(ROUTES.COURSE_DETAIL(courseId), { replace: true, state: { resetAll: true } });
        }, 900);
    }, [courseId, dispatch, navigate]);

    const { isChecking, error: paymentError } = useInvoicePaymentStatus({
        invoiceId: payment?.invoiceId,
        enabled: Boolean(payment?.isOpen && payment?.status === "PENDING_PAYMENT"),
        onPaid: finishPurchase,
    });

    const startPurchase = async () => {
        if (!courseDetail || isCreatingInvoice) return;

        setIsCreatingInvoice(true);
        try {
            const response = await courseService.registerManualInvoice(courseDetail.code || courseDetail.courseId || courseId);
            const invoiceDetails = getInvoiceDetails(response);

            if (!invoiceDetails.invoiceId) throw new Error("Không nhận được mã hóa đơn thanh toán.");

            setPayment({ ...invoiceDetails, isOpen: true });

            if (invoiceDetails.status === "PAID") {
                window.setTimeout(finishPurchase, 900);
            }
        } catch (requestError) {
            dispatch(addNotification({
                type: "error",
                title: "Không thể tạo hóa đơn",
                message: requestError?.message || "Vui lòng thử lại sau.",
                autoHide: true,
            }));
        } finally {
            setIsCreatingInvoice(false);
        }
    };

    const scrollToLessons = () => {
        document.getElementById("course-lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const purchaseAction = { Icon: ShoppingCart, label: isCreatingInvoice ? "Đang tạo hóa đơn..." : "Mua khóa học", onClick: startPurchase, disabled: isCreatingInvoice };

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

            <PurchasePaymentModal
                isOpen={Boolean(payment?.isOpen)}
                onClose={() => setPayment(null)}
                course={courseDetail}
                invoice={payment?.invoice}
                invoiceId={payment?.invoiceId}
                profile={profile}
                status={payment?.status}
                isChecking={isChecking}
                error={paymentError}
            />
        </main>
    );
};

export default CoursePurchaseDetailPage;
