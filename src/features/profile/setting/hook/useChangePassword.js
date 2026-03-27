import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { changePasswordAsync } from "../../store/profileSlice";

const initialForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export const useChangePassword = () => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState(initialForm);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    }, [error]);

    const validate = useCallback(() => {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            return "Vui lòng điền đầy đủ thông tin";
        }
        if (form.newPassword.length < 6) {
            return "Mật khẩu mới phải có ít nhất 6 ký tự";
        }
        if (form.newPassword !== form.confirmPassword) {
            return "Mật khẩu xác nhận không khớp";
        }

        return "";
    }, [form]);

    const submitChangePassword = useCallback(async () => {
        const validateError = validate();
        if (validateError) {
            setError(validateError);
            return false;
        }

        setSaving(true);
        setError("");

        try {
            await dispatch(
                changePasswordAsync({
                    oldPassword: form.currentPassword,
                    newPassword: form.newPassword,
                })
            ).unwrap();

            setForm(initialForm);
            return true;
        } catch {
            setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [dispatch, form, validate]);

    const canSubmit = useMemo(() => !saving, [saving]);

    return {
        form,
        saving,
        error,
        canSubmit,
        handleChange,
        submitChangePassword,
    };
};

export default useChangePassword;
