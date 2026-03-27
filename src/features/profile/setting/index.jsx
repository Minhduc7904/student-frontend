import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Save } from "lucide-react";
import { Card } from "../../../shared/components";
import { ROUTES } from "../../../core/constants";
import { selectSettingTab } from "../store/profileSlice";
import { useChangePassword } from "./hook/useChangePassword";

const PasswordField = memo(({ label, name, value, onChange, placeholder, disabled }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all focus:border-[rgb(45,181,93)] focus:outline-none focus:ring-2 focus:ring-[rgba(45,181,93,0.18)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                />
                <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
});
PasswordField.displayName = "PasswordField";

const ProfileSettingPage = () => {
    const navigate = useNavigate();
    const activeTab = useSelector(selectSettingTab);
    const { form, saving, error, canSubmit, handleChange, submitChangePassword } = useChangePassword();

    const handleSubmitPassword = useCallback(
        async (e) => {
            e.preventDefault();
            await submitChangePassword();
        },
        [submitChangePassword]
    );

    return (
        <div className="flex gap-6 flex-col w-full">
            <button
                type="button"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="w-fit cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md"
            >
                Quay lại
            </button>
            <Card className="rounded-2xl border border-gray-200 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <h2 className="text-base font-semibold text-gray-900">Cài đặt hồ sơ</h2>

                </div>

                {activeTab === "password" ? (
                    <form onSubmit={handleSubmitPassword} className="mt-5 flex w-full flex-col gap-4">
                        <PasswordField
                            label="Mật khẩu hiện tại"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu hiện tại"
                            disabled={saving}
                        />
                        <PasswordField
                            label="Mật khẩu mới"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                            disabled={saving}
                        />
                        <PasswordField
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu mới"
                            disabled={saving}
                        />

                        {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}

                        <div className="mt-1 flex items-center justify-end border-t border-gray-100 pt-4">
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-linear-to-r from-[rgb(45,181,93)] to-[rgb(36,150,77)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={15} />
                                {saving ? "Đang lưu..." : "Đổi mật khẩu"}
                            </button>
                        </div>
                    </form>
                ) : null}

                {activeTab === "notification" ? (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">Thông báo học tập</p>
                        <p className="mt-1 text-xs text-gray-500">Tùy chọn thông báo sẽ được cập nhật trong bước tiếp theo.</p>
                    </div>
                ) : null}
            </Card>
        </div>
    );
};

export default memo(ProfileSettingPage);
