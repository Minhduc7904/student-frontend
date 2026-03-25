import { memo } from 'react';
import CompetitionRanking from './CompetitionRanking';
import SecondaryCompetitionList from './SecondaryCompetitionList';

/**
 * CompetitionBottomSection
 * Layout 2 cột dưới MainCompetitionList.
 */
const CompetitionBottomSection = () => {
    return (
        <section className="w-full mt-2">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-5">
                <div className="xl:col-span-5">
                    <CompetitionRanking />
                </div>

                <div className="xl:col-span-7">
                    <SecondaryCompetitionList />
                </div>
            </div>
        </section>
    );
};

export default memo(CompetitionBottomSection);
