import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpDown, Check, Eye, RefreshCw } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { Card, CustomDropdown, DebouncedSearchInput, Pagination } from '../../../shared/components';
import {
    fetchPublicStudentExams,
    selectPublicExams,
    selectPublicExamsError,
    selectPublicExamsFilters,
    selectPublicExamsLoading,
    selectPublicExamsPagination,
    selectSubjects,
    setPublicExamsFilters,
} from '../store/examsSlice';
import { getApiTypeCodeByExamTypeId, getExamTypeLabelById, normalizeExamType } from '../constants/examTypes';
import '../../competition/ranking/ranking-loading.css';

const isAttemptedExam = (attemptStatus) => String(attemptStatus || '').toUpperCase() === 'ATTEMPTED';

const ExamTypePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { examType } = useParams();
    const exams = useSelector(selectPublicExams);
    const loading = useSelector(selectPublicExamsLoading);
    const error = useSelector(selectPublicExamsError);
    const filters = useSelector(selectPublicExamsFilters);
    const pagination = useSelector(selectPublicExamsPagination);
    const subjects = useSelector(selectSubjects);
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');

    const normalizedType = normalizeExamType(examType);
    const examTypeLabel = getExamTypeLabelById(normalizedType);
    const apiTypeCode = getApiTypeCodeByExamTypeId(normalizedType);

    const examItems = useMemo(() => (Array.isArray(exams) ? exams : []), [exams]);
    const currentPage = pagination?.page ?? filters?.page ?? 1;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? examItems.length;

    const gradeFilterOptions = useMemo(
        () => [
            { label: 'Tất cả khối', value: '' },
            { label: 'Khối 10', value: '10' },
            { label: 'Khối 11', value: '11' },
            { label: 'Khối 12', value: '12' },
        ],
        []
    );

    const subjectFilterOptions = useMemo(() => {
        const normalizedSubjects = Array.isArray(subjects) ? subjects : [];
        const mappedOptions = normalizedSubjects.map((subject) => {
            const code = subject?.code ? `${subject.code} - ` : '';
            return {
                label: `${code}${subject?.name || 'Mon hoc'}`,
                value: String(subject?.subjectId ?? subject?.id ?? ''),
            };
        }).filter((option) => option.value);

        return [{ label: 'Tất cả môn', value: '' }, ...mappedOptions];
    }, [subjects]);

    const normalizedError = useMemo(() => {
        if (!error) return '';
        return typeof error === 'string' ? error : error?.message || 'Khong the tai danh sach de thi.';
    }, [error]);

    useEffect(() => {
        if (!apiTypeCode) return;

        dispatch(
            fetchPublicStudentExams({
                ...filters,
                page: filters?.page ?? 1,
                limit: filters?.limit ?? 10,
                typeOfExam: apiTypeCode,
                sortBy,
                sortOrder,
            })
        );
    }, [dispatch, apiTypeCode, filters?.page, filters?.limit, filters?.search, filters?.grade, filters?.subjectId, sortBy, sortOrder]);

    const handleReload = () => {
        if (!apiTypeCode) return;

        dispatch(
            fetchPublicStudentExams({
                ...filters,
                page: filters?.page ?? 1,
                limit: filters?.limit ?? 10,
                typeOfExam: apiTypeCode,
                sortBy,
                sortOrder,
            })
        );
    };

    const handlePageChange = (nextPage) => {
        dispatch(setPublicExamsFilters({ page: nextPage }));
    };

    const handleGradeFilterChange = useCallback((nextGradeValue) => {
        dispatch(
            setPublicExamsFilters({
                grade: nextGradeValue || null,
                page: 1,
            })
        );
    }, [dispatch]);

    const handleSearchFilterChange = useCallback((nextSearchValue) => {
        dispatch(
            setPublicExamsFilters({
                search: nextSearchValue,
                page: 1,
            })
        );
    }, [dispatch]);

    const handleSubjectFilterChange = useCallback((nextSubjectValue) => {
        dispatch(
            setPublicExamsFilters({
                subjectId: nextSubjectValue || null,
                page: 1,
            })
        );
    }, [dispatch]);

    const toggleSort = (field) => {
        dispatch(setPublicExamsFilters({ page: 1 }));
        if (sortBy === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }

        setSortBy(field);
        setSortOrder('desc');
    };

    const getSortLabel = (field) => {
        if (sortBy !== field) return 'Chua sap xep';
        return sortOrder === 'asc' ? 'Tang dan' : 'Giam dan';
    };

    const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

    const getRowHighlightClass = (index) => {
        return index % 2 === 0 ? 'border-transparent bg-[#f8fafc]' : 'border-transparent bg-[#f1f5f9]';
    };

    const goToExamDetail = useCallback((examId) => {
        if (!examId || !normalizedType) return;
        navigate(ROUTES.EXAM_TYPE_DETAIL(normalizedType, examId));
    }, [navigate, normalizedType]);

    if (!examTypeLabel) {
        return (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                <h1 className="text-lg font-bold text-gray-900 md:text-xl">Loai de thi khong hop le</h1>
                <p className="mt-2 text-sm text-gray-600">Vui long quay lai danh sach de thi de chon loai de khac.</p>
            </section>
        );
    }

    return (
        <Card>
            <div className="mb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 md:text-xl">{examTypeLabel}</h1>
                        <p className="text-sm text-gray-600">Tổng số đề đang có: {total}</p>
                    </div>

                    <div className="flex w-full flex-col md:flex-row items-start md:items-center justify-start gap-2 md:w-auto md:justify-end">
                        <button
                            type="button"
                            onClick={handleReload}
                            disabled={loading}
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-text-5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Reload
                        </button>

                        <div className="md:w-fit w-full items-center gap-2 flex md:flex-row flex-col">
                            <CustomDropdown
                                id="exam-grade-filter"
                                value={filters?.grade || ''}
                                options={gradeFilterOptions}
                                onChange={handleGradeFilterChange}
                                buttonClassName=" min-w-31 rounded-full border-slate-300 px-3 py-1 text-xs"
                                menuClassName="w-40"
                            />

                            <CustomDropdown
                                id="exam-subject-filter"
                                value={filters?.subjectId ? String(filters.subjectId) : ''}
                                options={subjectFilterOptions}
                                onChange={handleSubjectFilterChange}
                                buttonClassName=" min-w-38 rounded-full border-slate-300 px-3 py-1 text-xs"
                                menuClassName="w-56"
                            />
                        </div>

                        <DebouncedSearchInput
                            value={filters?.search || ''}
                            onDebouncedChange={handleSearchFilterChange}
                            placeholder="Tìm kiếm đề..."
                            debounceMs={1000}
                            containerClassName="w-full sm:w-58 md:w-56"
                            inputClassName="py-1 text-xs"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-500">
                            <div className="w-[4%] text-center"></div>
                            <div className="w-[8%] text-start">STT</div>
                            <button
                                type="button"
                                onClick={() => toggleSort('title')}
                                className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                                title={`Sap xep ten de: ${getSortLabel('title')}`}
                            >
                                Tên đề
                                <ArrowUpDown size={12} className={sortBy === 'title' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleSort('grade')}
                                className="cursor-pointer flex w-[10%] items-center gap-1 text-left"
                                title={`Sap xep khoi: ${getSortLabel('grade')}`}
                            >
                                Khối
                                <ArrowUpDown size={12} className={sortBy === 'grade' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <div className="w-[16%] text-start">Môn học</div>
                            <div className="w-[10%] text-start">Số câu</div>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {skeletonRows.map((rowIndex) => (
                                <div
                                    key={`exam-skeleton-${rowIndex}`}
                                    className="ranking-skeleton-row flex items-center rounded-xl border border-transparent bg-[#f8fafc] px-4 py-2 even:bg-[#f1f5f9]"
                                    style={{ animationDelay: `${rowIndex * 35}ms` }}
                                >
                                    <div className="w-[4%] flex justify-center">
                                        <div className="ranking-skeleton-block h-6 w-6 rounded-full" />
                                    </div>
                                    <div className="w-[8%]">
                                        <div className="ranking-skeleton-block h-4 w-6 rounded-md" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="ranking-skeleton-block h-4 w-40 rounded-md" />
                                    </div>
                                    <div className="w-[10%]">
                                        <div className="ranking-skeleton-block h-4 w-12 rounded-md" />
                                    </div>
                                    <div className="w-[16%]">
                                        <div className="ranking-skeleton-block h-4 w-16 rounded-md" />
                                    </div>
                                    <div className="w-[10%]">
                                        <div className="ranking-skeleton-block h-4 w-12 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2 space-y-2 md:hidden">
                        {skeletonRows.slice(0, 6).map((rowIndex) => (
                            <div
                                key={`exam-mobile-skeleton-${rowIndex}`}
                                className="rounded-xl border border-transparent bg-[#f8fafc] p-3 even:bg-[#f1f5f9]"
                            >
                                <div className="ranking-skeleton-block h-4 w-32 rounded-md" />
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                    <div className="ranking-skeleton-block h-4 w-full rounded-md" />
                                </div>
                                <div className="mt-3 ranking-skeleton-block h-8 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : normalizedError ? (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {normalizedError}
                </p>
            ) : examItems.length === 0 ? (
                <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Hien tai chua co de cho loai nay.
                </p>
            ) : (
                <div className="w-full overflow-hidden">
                    <div className="hidden w-full md:block">
                        <div className="flex w-full border-b border-gray-100 px-3 py-2 text-sm font-bold text-gray-600">
                            <div className="w-[4%] text-center"></div>
                            <div className="w-[8%] text-start">STT</div>
                            <button
                                type="button"
                                onClick={() => toggleSort('title')}
                                className="cursor-pointer flex flex-1 items-center gap-1 text-left"
                                title={`Sap xep ten de: ${getSortLabel('title')}`}
                            >
                                Tên đề
                                <ArrowUpDown size={12} className={sortBy === 'title' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleSort('grade')}
                                className="cursor-pointer flex w-[10%] items-center gap-1 text-left"
                                title={`Sap xep khoi: ${getSortLabel('grade')}`}
                            >
                                Khối
                                <ArrowUpDown size={12} className={sortBy === 'grade' ? 'text-blue-700' : 'text-gray-400'} />
                            </button>
                            <div className="w-[16%] text-start">Môn học</div>
                            <div className="w-[10%] text-start">Số câu</div>
                        </div>

                        <div className="mt-2 flex flex-col gap-0.5">
                            {examItems.map((exam, index) => (
                                <div
                                    key={String(exam?.examId ?? `${exam?.title || 'exam'}-${index}`)}
                                    className="cursor-pointer group relative overflow-hidden rounded-xl"
                                >
                                    <div
                                        role="button"
                                        tabIndex={exam?.examId ? 0 : -1}
                                        onClick={() => goToExamDetail(exam?.examId)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                goToExamDetail(exam?.examId);
                                            }
                                        }}
                                        className={`ranking-wave-row flex items-center border px-4 py-2 transition-all duration-300 md:group-hover:-translate-x-14 md:group-hover:mr-1 ${getRowHighlightClass(index)}`}
                                        style={{ animationDelay: `${Math.min(index, 19) * 55}ms` }}
                                    >
                                        <div className="w-[4%] flex justify-center">
                                            {isAttemptedExam(exam?.attemptStatus) ? (
                                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                                    <Check size={10} className="text-white" />
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="w-[8%] text-start text-sm font-semibold text-gray-700">
                                            {(currentPage - 1) * (pagination?.limit || filters?.limit || 10) + index + 1}
                                        </div>
                                        <div className="flex-1 text-start text-sm font-medium text-gray-700">{exam?.title || '--'}</div>
                                        <div className="w-[10%] text-start text-sm text-gray-700">{exam?.grade ?? '--'}</div>
                                        <div className="w-[16%] text-start text-sm text-gray-700">{exam?.subjectName || '--'}</div>
                                        <div className="w-[10%] text-start text-sm font-semibold text-gray-900">{exam?.questionCount ?? 0}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => goToExamDetail(exam?.examId)}
                                        disabled={!exam?.examId}
                                        className={`absolute right-0 top-0 hidden h-full w-14 translate-x-full items-center justify-center text-white opacity-0 scale-95 transition-all duration-500 md:flex md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-hover:scale-100 ${exam?.examId
                                            ? 'cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-95'
                                            : 'cursor-not-allowed bg-gray-400'
                                            }`}
                                        aria-label="Xem chi tiet de thi"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 md:hidden">
                        {examItems.map((exam, index) => (
                            <article
                                key={`mobile-${exam?.examId ?? `${exam?.title || 'exam'}-${index}`}`}
                                className={`cursor-pointer rounded-xl border px-3 py-3 ${getRowHighlightClass(index)}`}
                                onClick={() => goToExamDetail(exam?.examId)}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-gray-600">
                                        STT {(currentPage - 1) * (pagination?.limit || filters?.limit || 10) + index + 1}
                                    </p>
                                </div>

                                <div className="mt-2 flex items-start gap-2">
                                    <p className="flex-1 whitespace-normal wrap-break-word text-sm font-semibold text-gray-800">
                                        {exam?.title || '--'}
                                    </p>
                                    {isAttemptedExam(exam?.attemptStatus) ? (
                                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                                            <Check size={10} className="text-white" />
                                        </span>
                                    ) : null}
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Khoi: <span className="font-semibold text-slate-900">{exam?.grade ?? '--'}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        Mon: <span className="font-semibold text-slate-900">{exam?.subjectName || '--'}</span>
                                    </div>
                                    <div className="rounded-md bg-white/70 px-2 py-1.5 text-slate-600">
                                        So cau: <span className="font-semibold text-slate-900">{exam?.questionCount ?? 0}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        goToExamDetail(exam?.examId);
                                    }}
                                    disabled={!exam?.examId}
                                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Eye size={15} />
                                    Xem de thi
                                </button>
                            </article>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </Card>
    );
};

export default memo(ExamTypePage);
