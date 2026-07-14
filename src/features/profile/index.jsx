import { memo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card } from "../../shared/components";
import DifficultyCircleChart from "./components/DifficultyCircleChart";
import TotalPointCard from "./components/TotalPointCard";
import HeatmapChart from "./components/HeatmapChart";
import HistoryListCard from "./components/HistoryListCard";
import { getStudentTotalPoint } from "./utils/studentPointUtils";
import { ROUTES } from "../../core/constants";
/**
 * ProfilePage
 * Trang thông tin cá nhân học sinh
 */
const ProfilePage = () => {
    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const profile = outletContext?.profile;
    const totalPoint = getStudentTotalPoint(profile);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
                <Card className="flex-1">
                    <DifficultyCircleChart />
                </Card>
                <Card className="flex-1">
                    <TotalPointCard
                        totalPoint={totalPoint}
                        onClick={() => navigate(ROUTES.PROFILE_POINTS)}
                    />
                </Card>
            </div>
            <Card>
                <HeatmapChart />
            </Card>
            <Card>
                <HistoryListCard />
            </Card>
        </div>
    );
};

export default memo(ProfilePage);
