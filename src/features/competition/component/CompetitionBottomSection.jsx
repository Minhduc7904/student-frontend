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

                {/* LIST - lên trên ở mobile */}
                <div className="xl:col-span-7 order-1 xl:order-2">
                    <SecondaryCompetitionList />
                </div>

                {/* RANKING - xuống dưới ở mobile */}
                <div className="xl:col-span-5 order-2 xl:order-1">
                    <CompetitionRanking />
                </div>

            </div>
        </section>
    );
};

export default memo(CompetitionBottomSection);
