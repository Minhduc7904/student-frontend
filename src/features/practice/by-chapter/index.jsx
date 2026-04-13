import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import OngDocSach1 from '../../../assets/images/OngDocSach1.png';
import OngDocSach2 from '../../../assets/images/OngDocSach2.png';
import { ROUTES } from '../../../core/constants';
import PracticeOptionCard from '../component/PracticeOptionCard';

const CHAPTER_OPTIONS = [
    {
        id: 'exam-library',
        title: 'Thư viện đề theo chương',
        subtitle: 'Chọn chương và bắt đầu luyện với bộ đề có sẵn.',
        badge: 'Đề mẫu',
        action: 'Vào luyện',
        to: ROUTES.EXAMS,
        metricCount: 24,
        gradientFrom: '#2563eb',
        gradientTo: '#60a5fa',
    },
    {
        id: 'wrong-questions',
        title: 'Ôn lại câu sai theo chương',
        subtitle: 'Tập trung vào những chủ đề bạn đang yếu nhất.',
        badge: 'Tập trung',
        action: 'Xem câu sai',
        to: ROUTES.HISTORY_QUESTION,
        metricCount: 10,
        gradientFrom: '#db2777',
        gradientTo: '#f472b6',
    },
];

const PracticeByChapterPage = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full py-1">
            <div className="rounded-3xl border border-blue-100 bg-white p-4 md:p-6">
                <p className="text-h2 text-blue-800">Luyện theo chương</p>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
                    Chọn một cách luyện theo chương để bắt đầu. Bạn có thể làm đề mẫu theo từng chương
                    hoặc luyện lại các câu sai để củng cố kiến thức trọng tâm.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {CHAPTER_OPTIONS.map((option, index) => (
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
                            onClick={() => option.to && navigate(option.to)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(PracticeByChapterPage);