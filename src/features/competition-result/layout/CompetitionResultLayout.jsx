import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Logo } from '../../../shared/components';

/**
 * Layout riêng cho trang kết quả bài thi
 * Standalone – không dùng MainLayout/Sidebar
 */
const CompetitionResultLayout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-dvh bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 shadow-sm shrink-0 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
                    {/* Logo */}
                    <Logo
                        mode="default"
                        containerClassName="flex items-center"
                        className="h-8 sm:h-9 w-auto object-contain"
                    />

                    {/* Title */}
                    <span className="hidden sm:block text-subhead-5 font-semibold text-gray-700">
                        Kết quả bài thi
                    </span>

                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex cursor-pointer items-center gap-1.5 text-text-5 text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Quay lại</span>
                    </button>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {children}
            </main>
        </div>
    );
};

export default CompetitionResultLayout;
