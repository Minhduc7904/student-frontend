import { Outlet, Link, useLocation } from 'react-router-dom';

function MainLayout() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="min-h-dvh bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            Student Portal
                        </Link>
                        
                        <div className="flex items-center space-x-6">
                            <Link 
                                to="/" 
                                className={`hover:text-blue-600 transition-colors ${
                                    isActive('/') && location.pathname === '/' 
                                        ? 'text-blue-600 font-semibold' 
                                        : 'text-gray-700'
                                }`}
                            >
                                Trang chủ
                            </Link>
                            <Link 
                                to="/courses" 
                                className={`hover:text-blue-600 transition-colors ${
                                    isActive('/courses') 
                                        ? 'text-blue-600 font-semibold' 
                                        : 'text-gray-700'
                                }`}
                            >
                                Khóa học
                            </Link>
                            <Link 
                                to="/exams" 
                                className={`hover:text-blue-600 transition-colors ${
                                    isActive('/exams') 
                                        ? 'text-blue-600 font-semibold' 
                                        : 'text-gray-700'
                                }`}
                            >
                                Bài kiểm tra
                            </Link>
                            <Link 
                                to="/profile" 
                                className={`hover:text-blue-600 transition-colors ${
                                    isActive('/profile') 
                                        ? 'text-blue-600 font-semibold' 
                                        : 'text-gray-700'
                                }`}
                            >
                                Hồ sơ
                            </Link>
                            <Link 
                                to="/login" 
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Đăng xuất
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Student Portal</h3>
                            <p className="text-gray-400">
                                Nền tảng học tập trực tuyến dành cho học sinh
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Liên kết</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/" className="hover:text-white">Trang chủ</Link></li>
                                <li><Link to="/courses" className="hover:text-white">Khóa học</Link></li>
                                <li><Link to="/exams" className="hover:text-white">Bài kiểm tra</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                            <p className="text-gray-400">
                                Email: support@studentportal.com<br />
                                Hotline: 1900-xxxx
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 Student Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default MainLayout;
