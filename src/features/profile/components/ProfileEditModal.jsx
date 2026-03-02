import { memo, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X, Save, Loader2 } from "lucide-react";
import { updateProfileAsync } from "../store/profileSlice";

/**
 * InputField - Reusable form input
 */
const InputField = memo(({ label, name, type = "text", value, onChange, placeholder, disabled }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-subhead-5 text-gray-700">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-text-4 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
        />
    </div>
));
InputField.displayName = "InputField";

/**
 * SelectField - Reusable form select
 */
const SelectField = memo(({ label, name, value, onChange, options, disabled }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-subhead-5 text-gray-700">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-text-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
));
SelectField.displayName = "SelectField";

/**
 * ProfileEditModal Component
 * Modal chỉnh sửa thông tin cá nhân
 */
const ProfileEditModal = memo(({ isOpen, onClose, profile }) => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        gender: "MALE",
        dateOfBirth: "",
        studentPhone: "",
        parentPhone: "",
        grade: "",
        school: "",
    });

    // Sync form with profile khi modal mở
    useEffect(() => {
        if (isOpen && profile) {
            setForm({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                gender: profile.gender || "MALE",
                dateOfBirth: profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
                    : "",
                studentPhone: profile.studentPhone || "",
                parentPhone: profile.parentPhone || "",
                grade: profile.grade?.toString() || "",
                school: profile.school || "",
            });
        }
    }, [isOpen, profile]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                await dispatch(updateProfileAsync(form)).unwrap();
                onClose();
            } catch {
                // Error handled by slice
            } finally {
                setSaving(false);
            }
        },
        [dispatch, form, onClose]
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <h3 className="text-h3 text-gray-900">Chỉnh sửa thông tin</h3>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Đóng"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Họ"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Nhập họ"
                        />
                        <InputField
                            label="Tên"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Nhập tên"
                        />
                    </div>
                    <SelectField
                        label="Giới tính"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        options={[
                            { value: "MALE", label: "Nam" },
                            { value: "FEMALE", label: "Nữ" },
                            { value: "OTHER", label: "Khác" },
                        ]}
                    />
                    <InputField
                        label="Ngày sinh"
                        name="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Số điện thoại"
                        name="studentPhone"
                        type="tel"
                        value={form.studentPhone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                    />
                    <InputField
                        label="SĐT phụ huynh"
                        name="parentPhone"
                        type="tel"
                        value={form.parentPhone}
                        onChange={handleChange}
                        placeholder="Nhập SĐT phụ huynh"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Khối lớp"
                            name="grade"
                            type="number"
                            value={form.grade}
                            onChange={handleChange}
                            placeholder="VD: 12"
                        />
                        <InputField
                            label="Trường"
                            name="school"
                            value={form.school}
                            onChange={handleChange}
                            placeholder="Nhập tên trường"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl text-text-4 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-text-4 flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                        >
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

ProfileEditModal.displayName = "ProfileEditModal";

export default ProfileEditModal;
