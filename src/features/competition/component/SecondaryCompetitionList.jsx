import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContentLoading, Pagination } from '../../../shared/components';
import SecondaryStatusTabs from './SecondaryStatusTabs';
import SecondaryGradeSelect from './SecondaryGradeSelect';
import SecondaryCompetitionTableItem from './SecondaryCompetitionTableItem';
import {
    fetchSecondaryCompetitions,
    selectIsSelectingCompetition,
    selectSecondaryCompetitions,
    selectSecondaryCompetitionsError,
    selectSecondaryCompetitionsLoading,
    selectSecondaryCompetitionPagination,
    selectSelectedCompetitionId,
    setSelectedCompetition,
} from '../store/competitionSlice';

/**
 * SecondaryCompetitionList
 * Cột phải: 2 tab Đã diễn ra / Đã làm.
 */
const SecondaryCompetitionList = () => {
    const dispatch = useDispatch();
    const competitions = useSelector(selectSecondaryCompetitions);
    const isSelectingCompetition = useSelector(selectIsSelectingCompetition);
    const loading = useSelector(selectSecondaryCompetitionsLoading);
    const error = useSelector(selectSecondaryCompetitionsError);
    const pagination = useSelector(selectSecondaryCompetitionPagination);
    const selectedCompetitionId = useSelector(selectSelectedCompetitionId);
    const [activeStatus, setActiveStatus] = useState('ENDED');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [page, setPage] = useState(1);

    const currentPage = pagination?.page ?? page;
    const totalPages = pagination?.totalPages ?? 1;

    useEffect(() => {
        const query = {
            publicStatus: activeStatus,
            page,
            limit: 10,
            ...(selectedGrade ? { grade: Number(selectedGrade) } : {}),
        };

        dispatch(
            fetchSecondaryCompetitions(query)
        );
    }, [dispatch, activeStatus, selectedGrade, page]);

    useEffect(() => {
        setPage(1);
    }, [activeStatus, selectedGrade]);

    return (
        <section className="flex h-full min-h-240 w-full flex-col rounded-2xl border border-gray-100 bg-white p-4 md:p-5 xl:min-w-185">
            <div className="mb-3 flex md:flex-row flex-col items-center justify-between gap-3">
                <SecondaryStatusTabs
                    disabled={isSelectingCompetition}
                    onChange={setActiveStatus}
                />
                <SecondaryGradeSelect
                    disabled={isSelectingCompetition}
                    onChange={setSelectedGrade}
                />
            </div>

            {loading ? (
                <ContentLoading message="Đang tải danh sách cuộc thi..." height="py-12" />
            ) : error ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-text-4">
                    Không thể tải danh sách cuộc thi.
                </div>
            ) : !competitions?.length ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-text-4">
                    Không có cuộc thi trong danh mục này.
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        {competitions.slice(0, 10).map((item, index) => {
                            const id = item?.competitionId ?? item?.id;
                            const fallbackTitle = item?.title ?? item?.name ?? `Cuộc thi #${index + 1}`;

                            return (
                                <SecondaryCompetitionTableItem
                                    key={id ?? `${fallbackTitle}-${index}`}
                                    competition={item}
                                    activeStatus={activeStatus}
                                    index={index}
                                    isSelected={selectedCompetitionId === id}
                                    onSelect={(competition) => dispatch(setSelectedCompetition(competition))}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-auto pt-4">
                        <Pagination
                            currentPage={currentPage}
                            disabled={isSelectingCompetition}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}
        </section>
    );
};

export default memo(SecondaryCompetitionList);
