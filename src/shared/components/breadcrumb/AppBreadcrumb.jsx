import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AppBreadcrumb
 * Breadcrumb dung chung cho cac trang trong he thong.
 */
const AppBreadcrumb = ({ items = [], className = '' }) => {
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className={`mb-4 flex flex-wrap items-center gap-2 text-sm ${className}`.trim()}>
            {items.map((item, index) => {
                const key = `${item?.label || 'breadcrumb'}-${index}`;
                const isLast = index === items.length - 1;

                return (
                    <div key={key} className="flex items-center gap-2 min-w-0">
                        {index > 0 ? <ChevronRight size={16} className="text-gray-400 shrink-0" /> : null}

                        {item?.to && !isLast ? (
                            <Link
                                to={item.to}
                                className="truncate font-medium text-gray-500 transition-colors hover:text-blue-700"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`truncate ${isLast ? 'font-semibold text-gray-800' : 'font-medium text-gray-500'}`}>
                                {item?.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default AppBreadcrumb;
