import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../core/constants";

const CoursePurchaseDetailPlaceholder = () => {
    const { courseId } = useParams();

    return (
        <main className="w-full text-blue-950">
            <Link to={ROUTES.COURSE_MARKETPLACE} className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-blue-800 transition hover:text-blue-950">
                <ArrowLeft size={17} />
                Quay lại mua khóa học
            </Link>
            <section className="mt-8 flex min-h-80 flex-col items-center justify-center border border-dashed border-blue-200 bg-white px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-50 text-blue-800"><ShoppingCart size={27} /></span>
                <h1 className="mt-5 text-2xl font-bold">Chi tiết mua khóa học</h1>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">Khóa học #{courseId} sẽ có trang giới thiệu, ưu đãi và thanh toán riêng. Phần này được tách hoàn toàn khỏi trang học của học sinh.</p>
            </section>
        </main>
    );
};

export default CoursePurchaseDetailPlaceholder;
