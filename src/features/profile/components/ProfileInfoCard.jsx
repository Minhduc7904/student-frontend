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
    <div className="flex gap-3 pt-3">
        {/* Icon */}
        <div className="flex items-start justify-center shrink-0">
            <Icon size={16} className={iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            {/* Row: icon + label */}
            <p className="text-[14px] leading-[14px] font-medium text-gray-800">
                {label}
            </p>

            {/* Value */}
            <p className="text-text-5  truncate  text-gray-500">
                {value || "Chưa cập nhật"}
            </p>
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
        <div className="">
            <h3 className="text-subhead-4 text-gray-900 mb-2">Thông tin cá nhân</h3>
            <div className="">
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
