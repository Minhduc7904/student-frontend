import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import OngDocSach1 from '../../assets/images/OngDocSach1.png';
import OngDocSach2 from '../../assets/images/OngDocSach2.png';
import OngLuyenDeImage from '../../assets/images/OngLuyenDe.png';
import { ROUTES } from '../../core/constants';
import PracticeOptionCard from './component/PracticeOptionCard';

const PRACTICE_OPTIONS = [
    {
        id: 'practice-by-chapter',
        title: 'Luyện theo chương',
        subtitle: 'Ôn tập từng chương theo lộ trình rõ ràng và bám sát kiến thức.',
        badge: 'Phổ biến',
        action: 'Bắt đầu luyện',
        to: ROUTES.PRACTICE_BY_CHAPTER,
        metricCount: 12,
        gradientFrom: '#0ea5e9',
        gradientTo: '#38bdf8',
    },
    {
        id: 'custom-practice',
        title: 'Tự tạo đề thi',
        subtitle: 'Tự chọn phạm vi kiến thức, số câu và thời gian làm bài.',
        badge: 'Cá nhân hóa',
        action: 'Khám phá',
        to: null,
        metricCount: 0,
        gradientFrom: '#f59e0b',
        gradientTo: '#fbbf24',
    },
    {
        id: 'redo-wrong-answers',
        title: 'Làm lại câu sai',
        subtitle: 'Tập trung xử lý điểm yếu với danh sách câu hỏi bạn từng sai.',
        badge: 'Hiệu quả',
        action: 'Xem câu sai',
        to: ROUTES.HISTORY_QUESTION,
        metricCount: 8,
        gradientFrom: '#ec4899',
        gradientTo: '#f472b6',
    },
    {
        id: 'your-practice-sets',
        title: 'Đề của bạn',
        subtitle: 'Quản lý đề đã tạo, đề đã làm và theo dõi tiến độ cá nhân.',
        badge: 'Sắp ra mắt',
        action: 'Theo dõi',
        to: null,
        metricCount: 0,
        gradientFrom: '#10b981',
        gradientTo: '#34d399',
    },
];

/**
 * PracticePage
 * Trang chính của phòng luyện đề với bố cục 2 cột.
 */
const PracticePage = () => {
    const navigate = useNavigate();

    const handleSelectOption = (path) => {
        if (!path) return;
        navigate(path);
    };

    return (
        <section className="py-1">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.35fr)] lg:items-start">
                <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-linear-to-br from-blue-50 via-sky-50 to-cyan-100 p-5 md:p-7 lg:sticky lg:top-4">
                    <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/55 blur-2xl" />

                    <div className="relative z-10">
                        <img
                            src={OngLuyenDeImage}
                            alt="Phòng luyện đề"
                            className="mx-auto mb-3 h-auto w-30 object-contain lg:mx-0"
                        />

                        <p className="text-h2 text-center text-blue-800 lg:text-left">
                            Phòng luyện đề
                        </p>

                        <p className="mt-2 text-center text-sm leading-relaxed text-gray-700 lg:text-left">
                            Luyện đúng trọng tâm theo mục tiêu của bạn: học theo chương, làm lại câu sai
                            hoặc cá nhân hóa đề thi để tăng tốc tiến bộ từng ngày.
                        </p>

                        <div className="mt-4 space-y-2 rounded-2xl bg-white/60 p-3 text-sm text-gray-700 backdrop-blur-sm">
                            <p>• Chọn chế độ luyện phù hợp với thời gian rảnh.</p>
                            <p>• Theo dõi tiến độ và cải thiện điểm yếu rõ ràng.</p>
                            <p>• Trải nghiệm luyện tập nhanh, trực quan và tập trung.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PRACTICE_OPTIONS.map((option, index) => (
                        <PracticeOptionCard
                            key={option.id}
                            title={option.title}
                            subtitle={option.subtitle}
                            badge={option.badge}
                            action={option.action}
                            imageSrc={index % 2 === 0 ? OngDocSach1 : OngDocSach2}
                            metricCount={option.metricCount}
                            gradientFrom={option.gradientFrom}
                            gradientTo={option.gradientTo}
                            disabled={!option.to}
                            onClick={() => handleSelectOption(option.to)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(PracticePage);
