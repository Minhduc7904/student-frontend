import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { selectEditInfoTab, updateProfileAsync } from "../store/profileSlice";
import { Card } from "../../../shared/components";
import { ROUTES } from "../../../core/constants";
import ProfileAvatar from "../components/ProfileAvatar";

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
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
));
SelectField.displayName = "SelectField";

const ProfileEditInforPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const outletContext = useOutletContext();
    const profile = outletContext?.profile;
    const activeTab = useSelector(selectEditInfoTab);

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

    useEffect(() => {
        if (!profile) return;

        setForm({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            gender: profile.gender || "MALE",
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
            studentPhone: profile.studentPhone || "",
            parentPhone: profile.parentPhone || "",
            grade: profile.grade?.toString() || "",
            school: profile.school || "",
        });
    }, [profile]);

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
                navigate(ROUTES.PROFILE);
            } catch {
                // Error handled by slice
            } finally {
                setSaving(false);
            }
        },
        [dispatch, form, navigate]
    );

    return (
        <div className="flex gap-6 flex-col w-full">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.PROFILE)}
                    className="w-fit cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md"
                >
                    Quay lại
                </button>
            </div>
            <Card className="overflow-hidden rounded-2xl border border-gray-200 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Chỉnh sửa thông tin</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                    {activeTab === "basic" ? (
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-800">Thông tin cơ bản</p>
                            <div className="mb-4">
                                <p className="text-center mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Ảnh đại diện</p>
                                <ProfileAvatar avatarUrl={profile?.avatarUrl} fullName={profile?.fullName || "Avatar"} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InputField
                                    label="Họ"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ"
                                    disabled={saving}
                                />
                                <InputField
                                    label="Tên"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="Nhập tên"
                                    disabled={saving}
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
                                    disabled={saving}
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
                                    disabled={saving}
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
                                    disabled={saving}
                                />
                                <InputField
                                    label="SĐT phụ huynh"
                                    name="parentPhone"
                                    type="tel"
                                    value={form.parentPhone}
                                    onChange={handleChange}
                                    placeholder="Nhập SĐT phụ huynh"
                                    disabled={saving}
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
                                    disabled={saving}
                                />
                                <InputField
                                    label="Trường"
                                    name="school"
                                    value={form.school}
                                    onChange={handleChange}
                                    placeholder="Nhập tên trường"
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-2 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.PROFILE)}
                            disabled={saving}
                            className="cursor-pointer rounded-lg bg-[#F7F7F8] px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-linear-to-r from-[rgb(45,181,93)] to-[rgb(36,150,77)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default memo(ProfileEditInforPage);
