import { BookOpen, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../../../core/constants";

const CourseModeTabs = () => {
    const { pathname } = useLocation();
    const isMarketplace = pathname.startsWith(ROUTES.COURSE_MARKETPLACE);

    const tabs = [
        { label: "Khóa học của tôi", icon: BookOpen, to: ROUTES.COURSE_ENROLLMENTS, active: !isMarketplace },
        { label: "Mua khóa học", icon: ShoppingCart, to: ROUTES.COURSE_MARKETPLACE, active: isMarketplace },
    ];

    return (
        <nav className="flex w-full justify-end gap-2 overflow-x-auto pb-1" aria-label="Chế độ khóa học">
            {tabs.map(({ label, icon: Icon, to, active }) => (
                <Link
                    key={to}
                    to={to}
                    className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${active
                        ? "bg-blue-800 text-white shadow-sm"
                        : "border border-blue-100 bg-white text-blue-800 hover:bg-blue-50"}`}
                    aria-current={active ? "page" : undefined}
                >
                    <Icon size={17} />
                    {label}
                </Link>
            ))}
        </nav>
    );
};

export default CourseModeTabs;
