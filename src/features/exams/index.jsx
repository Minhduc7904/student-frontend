import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DeMauImage from '../../assets/images/DeMau.png';
import OngDocSach1 from '../../assets/images/OngDocSach1.png';
import OngDocSach2 from '../../assets/images/OngDocSach2.png';
import { ROUTES } from '../../core/constants';
import {
    selectExams,
    selectExamsError,
    selectPublicExamTypeCounts,
} from './store/examsSlice';
import ExamTypeCard from './component/ExamTypeCard';
import { examTypeOptions, mapApiTypeCodeToExamTypeId, normalizeExamType } from './constants/examTypes';

const fallbackExams = [
    {
        id: 'e1',
        title: 'De mau Toan hoc - cap do co ban',
        examType: 'midterm-1',
        questionCount: 25,
        durationMinutes: 30,
        level: 'Co ban',
    },
    {
        id: 'e2',
        title: 'De mau tieng Anh - thi giua ky',
        examType: 'midterm-2',
        questionCount: 40,
        durationMinutes: 45,
        level: 'Trung binh',
    },
    {
        id: 'e3',
        title: 'De mau Khoa hoc tu nhien - tong hop',
        examType: 'final-1',
        questionCount: 50,
        durationMinutes: 60,
        level: 'Nang cao',
    },
    {
        id: 'e4',
        title: 'De mau Ngu van - doc hieu va nghi luan',
        examType: 'final-2',
        questionCount: 20,
        durationMinutes: 35,
        level: 'Co ban',
    },
];

/**
 * ExamsPage
 * Trang danh sách đề mẫu (/exams).
 */
const ExamsPage = () => {
    const navigate = useNavigate();
    const exams = useSelector(selectExams);
    const error = useSelector(selectExamsError);
    const publicTypeCounts = useSelector(selectPublicExamTypeCounts);

    const renderedExams = useMemo(() => {
        if (Array.isArray(exams) && exams.length > 0) {
            return exams;
        }
        return fallbackExams;
    }, [exams]);

    const examCountByTypeFromLocal = useMemo(() => {
        return renderedExams.reduce((acc, exam) => {
            const rawType = exam.examType || exam.type || exam.category || exam.exam_type;
            const normalizedType = normalizeExamType(rawType);

            if (!normalizedType) return acc;
            acc[normalizedType] = (acc[normalizedType] || 0) + 1;
            return acc;
        }, {});
    }, [renderedExams]);

    const examCountByTypeFromApi = useMemo(() => {
        const countMap = {};
        const items = Array.isArray(publicTypeCounts?.items) ? publicTypeCounts.items : [];

        items.forEach((item) => {
            const mappedTypeId = mapApiTypeCodeToExamTypeId(item?.typeOfExam);
            if (!mappedTypeId) return;

            countMap[mappedTypeId] = Number(item?.total) || 0;
        });

        return countMap;
    }, [publicTypeCounts]);

    const examCountByType = useMemo(() => {
        if (Object.keys(examCountByTypeFromApi).length > 0) {
            return examCountByTypeFromApi;
        }
        return examCountByTypeFromLocal;
    }, [examCountByTypeFromApi, examCountByTypeFromLocal]);

    const handleGoExamType = (typeId) => {
        navigate(`${ROUTES.EXAMS}/${typeId}`);
    };

    return (
        <section className="py-1">
            <div className="mb-4 flex flex-col gap-4">
                <div>
                    <img
                        src={DeMauImage}
                        alt="Đề mẫu"
                        className="mx-auto mb-2 h-auto w-30 object-contain"
                    />
                    <p className="text-h2 text-blue-800 text-center">Chọn loại đề thi</p>
                    <p className="text-center text-gray-600">Chọn một loại đề thi mà bạn muốn luyện tập</p>
                </div>
                <div className="mt-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {examTypeOptions.map((type, index) => (
                        <ExamTypeCard
                            key={type.id}
                            title={type.label}
                            imageSrc={index % 2 === 0 ? OngDocSach1 : OngDocSach2}
                            examCount={examCountByType[type.id] || 0}
                            gradientFrom={type.gradientFrom}
                            gradientTo={type.gradientTo}
                            darkText={type.darkText}
                            onClick={() => handleGoExamType(type.id)}
                        />
                    ))}
                </div>
            </div>

            {error ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}
        </section>
    );
};

export default memo(ExamsPage);
