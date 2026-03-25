import TrophyImage from '../../assets/images/Trophy.png';
import MainCompetitionList from './component/MainCompetitionList';
import CompetitionBottomSection from './component/CompetitionBottomSection';

/**
 * CompetitionPage
 * Trang base cho module Competition.
 */
const CompetitionPage = () => {
    return (
        <div className="w-full min-h-[70vh] flex items-start justify-center">
            <div className="flex flex-col items-center justify-start gap-3 w-full">
                <img
                    src={TrophyImage}
                    alt="Trophy"
                    className="w-40 h-auto object-contain"
                />
                {/* Title and description */}
                <div className="flex justify-center items-center w-full">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-h2 text-blue-800 text-center">Cuộc thi đang diễn ra</span>
                        <span className="text-text-4 text-gray-600 text-center">
                            Cuộc thi diễn ra hàng tuần, hãy tham gia thi và xem bảng xếp hạng.
                        </span>
                    </div>
                </div>

                <MainCompetitionList />
                <CompetitionBottomSection />
            </div>
        </div>
    );
};

export default CompetitionPage;
