import { memo, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X, Save, Loader2 } from "lucide-react";
import { updateProfileAsync } from "../store/profileSlice";
import { Modal } from "../../../shared/components/modal/Modal";

/**
 * InputField - Reusable form input
 */
const InputField = memo(({ label, name, type = "text", value, onChange, placeholder, disabled }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-gray-600">
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all focus:border-[rgb(45,181,93)] focus:outline-none focus:ring-2 focus:ring-[rgba(45,181,93,0.18)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        />
    </div>
));
InputField.displayName = "InputField";

/**
 * SelectField - Reusable form select
 */
const SelectField = memo(({ label, name, value, onChange, options, disabled }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all focus:border-[rgb(45,181,93)] focus:outline-none focus:ring-2 focus:ring-[rgba(45,181,93,0.18)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
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
    const [activeTab, setActiveTab] = useState("basic");
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
            setActiveTab("basic");
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

            const normalizedPayload = {
                ...form,
                dateOfBirth: form.dateOfBirth ? `${form.dateOfBirth}T00:00:00.000Z` : undefined,
                grade: form.grade === "" ? undefined : Number(form.grade),
            };

            try {
                await dispatch(updateProfileAsync(normalizedPayload)).unwrap();
                onClose();
            } catch {
                // Error handled by slice
            } finally {
                setSaving(false);
            }
        },
        [dispatch, form, onClose]
    );

    const tabs = [
        { key: "basic", label: "Cơ bản" },
        { key: "personal", label: "Cá nhân" },
        { key: "contact", label: "Liên hệ" },
        { key: "study", label: "Học tập" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} overlayClassName="bg-black/30 backdrop-blur-sm">
            <div
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto custom-scrollbar rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Chỉnh sửa thông tin</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 w-9 cursor-pointer rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                            aria-label="Đóng"
                        >
                            <X size={20} className="mx-auto" />
                        </button>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`cursor-pointer rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                                    activeTab === tab.key
                                        ? "bg-[rgba(45,181,93,0.12)] text-[rgb(36,150,77)]"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {activeTab === "basic" ? (
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-800">Thông tin cơ bản</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        </div>
                    ) : null}

                    {activeTab === "personal" ? (
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-800">Thông tin cá nhân</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                            </div>
                        </div>
                    ) : null}

                    {activeTab === "contact" ? (
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-800">Thông tin liên hệ</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                            </div>
                        </div>
                    ) : null}

                    {activeTab === "study" ? (
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-800">Thông tin học tập</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        </div>
                    ) : null}

                    {/* Actions */}
                    <div className="mt-2 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-[rgb(45,181,93)] to-[rgb(36,150,77)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
});

ProfileEditModal.displayName = "ProfileEditModal";

export default ProfileEditModal;
