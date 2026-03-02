import { memo } from "react";
import {
    User,
    Phone,
    Calendar,
    GraduationCap,
    BookOpen,
    Users,
} from "lucide-react";

/**
 * InfoRow - Single row of profile information
 */
const InfoRow = memo(({ icon: Icon, label, value, iconColor = "text-blue-800" }) => (
    <div className="flex items-start gap-3 py-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Icon size={18} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-text-5 text-gray-500">{label}</p>
            <p className="text-text-4 text-gray-900 truncate">{value || "Chưa cập nhật"}</p>
        </div>
    </div>
));
InfoRow.displayName = "InfoRow";

/**
 * Format gender
 */
const formatGender = (gender) => {
    const map = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };
    return map[gender] || null;
};

/**
 * ProfileInfoCard Component
 * Hiển thị thông tin cá nhân chi tiết
 */
const ProfileInfoCard = memo(({ profile }) => {
    const infoItems = [
        {
            icon: User,
            label: "Tên đăng nhập",
            value: profile?.username,
        },
        {
            icon: Users,
            label: "Giới tính",
            value: formatGender(profile?.gender),
        },
        {
            icon: Calendar,
            label: "Ngày sinh",
            value: profile?.dateOfBirth
                ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
                : null,
        },
        {
            icon: Phone,
            label: "Số điện thoại",
            value: profile?.studentPhone,
        },
        {
            icon: Phone,
            label: "SĐT phụ huynh",
            value: profile?.parentPhone,
        },
        {
            icon: GraduationCap,
            label: "Khối lớp",
            value: profile?.grade ? `Lớp ${profile.grade}` : null,
        },
        {
            icon: BookOpen,
            label: "Trường",
            value: profile?.school,
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-h3 text-gray-900 mb-2">Thông tin cá nhân</h3>
            <div className="divide-y divide-gray-100">
                {infoItems.map((item, index) => (
                    <InfoRow
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </div>
        </div>
    );
});

ProfileInfoCard.displayName = "ProfileInfoCard";

export default ProfileInfoCard;
