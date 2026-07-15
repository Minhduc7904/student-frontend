import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, Image } from "../../../shared/components/images";
import { ROUTES } from "../../../core/constants";
import {
    formatCoursePrice,
    getMarketplaceSubject,
    getMarketplaceTeacher,
    getMarketplaceThumbnail,
} from "./marketplaceUtils";

const MarketplaceCourseCard = ({ course }) => {
    const teacher = getMarketplaceTeacher(course);
    const comparePrice = Number(course?.compareAtVND);
    const hasComparePrice = Number.isFinite(comparePrice) && comparePrice > Number(course?.priceVND || 0);

    return (
        <Link
            to={ROUTES.COURSE_PURCHASE_DETAIL(course.courseId)}
            className="group block cursor-pointer overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
            aria-label={`Xem khóa học ${course?.title || ""}`}
        >
            <div className="relative aspect-[16/9] overflow-hidden bg-blue-100">
                <Image src={getMarketplaceThumbnail(course)} alt={course?.title || "Ảnh khóa học"} className="h-full w-full" loading="lazy" />
                {course?.hasDiscount && course?.discountPercentage ? (
                    <span className="absolute right-3 top-3 rounded-lg bg-yellow-500 px-2.5 py-1 text-xs font-bold text-blue-950">
                        Giảm {course.discountPercentage}%
                    </span>
                ) : null}
            </div>

            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">{getMarketplaceSubject(course)}</span>
                    {course?.grade ? <span className="rounded-lg bg-yellow-50 px-2.5 py-1 text-xs font-bold text-blue-950">Khối {course.grade}</span> : null}
                    {course?.academicYear ? <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{course.academicYear}</span> : null}
                </div>

                <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-blue-950">{course?.title || "Khóa học đang cập nhật"}</h2>
                        {course?.subtitle ? <p className="mt-1 truncate text-sm text-gray-600">{course.subtitle}</p> : null}
                    </div>
                    <ArrowUpRight size={18} className="mt-1 shrink-0 text-blue-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-blue-100 pt-4">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Học phí</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-lg font-bold text-blue-950">{formatCoursePrice(course)}</span>
                            {hasComparePrice ? <span className="text-xs font-semibold text-gray-400 line-through">{new Intl.NumberFormat("vi-VN").format(comparePrice)} đ</span> : null}
                        </div>
                    </div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-white transition group-hover:bg-blue-900" title="Xem và mua khóa học">
                        <ShoppingCart size={17} />
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <Avatar src={teacher.avatarUrl} alt={teacher.name} size="sm" className="shrink-0 ring-2 ring-blue-50" />
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">Giáo viên</p>
                        <p className="truncate text-sm font-bold text-blue-950">{teacher.name}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MarketplaceCourseCard;
