import { memo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Lock, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { changePasswordAsync } from "../store/profileSlice";

/**
 * PasswordField
 */
const PasswordField = memo(({ label, name, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-subhead-5 text-gray-700">
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
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 bg-white text-text-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-colors"
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
});
PasswordField.displayName = "PasswordField";

/**
 * SecurityTab Component
 * Tab bảo mật – đổi mật khẩu
 */
const SecurityTab = memo(() => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setError("");

            if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
                setError("Vui lòng điền đầy đủ thông tin");
                return;
            }
            if (form.newPassword.length < 6) {
                setError("Mật khẩu mới phải có ít nhất 6 ký tự");
                return;
            }
            if (form.newPassword !== form.confirmPassword) {
                setError("Mật khẩu xác nhận không khớp");
                return;
            }

            setSaving(true);
            try {
                await dispatch(
                    changePasswordAsync({
                        oldPassword: form.currentPassword,
                        newPassword: form.newPassword,
                    })
                ).unwrap();
                setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } catch {
                setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
            } finally {
                setSaving(false);
            }
        },
        [form]
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Lock size={20} className="text-blue-800" />
                </div>
                <div>
                    <h3 className="text-h3 text-gray-900">Đổi mật khẩu</h3>
                    <p className="text-text-5 text-gray-500">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <PasswordField
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu hiện tại"
                />
                <PasswordField
                    label="Mật khẩu mới"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu mới"
                />
                <PasswordField
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu mới"
                />

                {error && (
                    <p className="text-text-5 text-red-500">{error}</p>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-text-4 flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {saving ? "Đang lưu..." : "Đổi mật khẩu"}
                    </button>
                </div>
            </form>
        </div>
    );
});

SecurityTab.displayName = "SecurityTab";

export default SecurityTab;
