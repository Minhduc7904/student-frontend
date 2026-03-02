import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
    Pencil,
    Star,
    BookOpen,
} from "lucide-react";
import { selectProfile } from "./store/profileSlice";
import {
    ProfileAvatar,
    ProfileInfoCard,
    ProfileEditModal,
    ProfileSidebar,
    SecurityTab,
    PROFILE_TABS,
} from "./components";

/**
 * StatCard - Small stat display card
 */
const StatCard = memo(({ icon: Icon, label, value, color = "bg-blue-100", iconColor = "text-blue-800" }) => (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex-1 min-w-35">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
            <Icon size={20} className={iconColor} />
        </div>
        <div>
            <p className="text-h3 text-gray-900">{value}</p>
            <p className="text-text-5 text-gray-500">{label}</p>
        </div>
    </div>
));
StatCard.displayName = "StatCard";

/**
 * ProfilePage
 * Trang thông tin cá nhân học sinh
 */
const ProfilePage = () => {
    const profile = useSelector(selectProfile);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(PROFILE_TABS.INFO);

    const handleOpenEdit = useCallback(() => {
        setIsEditOpen(true);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setIsEditOpen(false);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="w-full">


                {/* Profile Header */}
                <div className="relative bg-linear-to-br from-blue-800 to-blue-900 rounded-2xl px-6 pt-16 pb-6 mb-20">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-60 h-60 bg-white rounded-full" />
                        <div className="absolute -left-5 -bottom-5 w-40 h-40 bg-white rounded-full" />
                    </div>

                    {/* Edit button */}
                    <button
                        onClick={handleOpenEdit}
                        className="absolute top-4 right-4 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-text-5 rounded-xl flex items-center gap-2 transition-colors backdrop-blur-sm cursor-pointer"
                    >
                        <Pencil size={14} />
                        Chỉnh sửa
                    </button>

                    {/* Avatar + Name row - overlaps bottom of banner */}
                    <div className="absolute -bottom-14 left-6 flex items-end gap-5">
                        <ProfileAvatar
                            avatarUrl={profile?.avatarUrl}
                            fullName={profile?.fullName}
                        />
                        <div className="pb-3">
                            <h1 className="text-h2 text-white font-bold truncate">
                                {profile?.fullName || "Học sinh"}
                            </h1>
                            <p className="text-text-4 text-gray-500 mt-0.5">
                                @{profile?.username || ""}
                            </p>
                            {profile?.grade && (
                                <p className="text-text-5 text-gray-500 mt-1">
                                    Lớp {profile.grade}{profile.school ? ` - ${profile.school}` : ""}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <StatCard
                        icon={Star}
                        label="Điểm tích lũy"
                        value={profile?.points ?? 0}
                        color="bg-yellow-50"
                        iconColor="text-yellow-500"
                    />
                    <StatCard
                        icon={BookOpen}
                        label="Khóa học"
                        value={profile?.enrolledCourses ?? 0}
                        color="bg-green-100"
                        iconColor="text-green-500"
                    />
                </div>


                {/* Right content area */}
                <div className="flex-1 min-w-0">
                    {activeTab === PROFILE_TABS.INFO && (
                        <ProfileInfoCard profile={profile} />
                    )}
                    {activeTab === PROFILE_TABS.SECURITY && (
                        <SecurityTab />
                    )}
                </div>

                {/* Edit Modal */}
                <ProfileEditModal
                    isOpen={isEditOpen}
                    onClose={handleCloseEdit}
                    profile={profile}
                />
            </div>
        </div >
    );
};

export default memo(ProfilePage);
