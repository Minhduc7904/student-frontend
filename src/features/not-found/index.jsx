import { Link } from 'react-router-dom';
import { ROUTES } from '../../core/constants';

function NotFoundPage() {
    return (
        <div className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Không tìm thấy trang
                </h2>
                <p className="text-gray-600 mb-8">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link
                    to={ROUTES.DASHBOARD}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg inline-block"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
