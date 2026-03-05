import { useState } from "react";
import Eye from "../../../../assets/icons/Eye.svg";
import EyeHide from "../../../../assets/icons/EyeHide.svg";
import { SvgIcon, ButtonLoading, ComingSoonModal } from "../../../../shared/components";
import CheckBox from "../../../../assets/icons/CheckBox.svg";
import CheckBoxOutline from "../../../../assets/icons/CheckBoxOutline.svg";
import GoogleLogo from "../../../../assets/icons/GoogleLogo.svg";

const TogglePasswordVisibility = ({ isVisible, onToggle }) => {
    return (
        <div className="flex flex-row gap-1 cursor-pointer" onClick={onToggle}>
            <div className="flex justify-center items-center text-text-5 text-gray-700">
                {isVisible ? "Ẩn" : "Hiện"}
            </div>
            <SvgIcon
                src={isVisible ? Eye : EyeHide}
                className="w-6 h-6"
            />
        </div>
    )
}

const ForgotPasswordLink = ({ onClick }) => {
    return (
        <div className="flex w-full items-center justify-end">
            <p
                onClick={onClick}
                className="text-text-5 text-blue-800 underline hover:font-semibold cursor-pointer"
            >
                Quên mật khẩu
            </p>
        </div>
    )
}

const RememberMeCheckbox = ({ checked, onChange }) => {
    return (
        <div className="w-full flex justify-start items-center">
            <div
                className="flex justify-center items-center gap-1 cursor-pointer"
                onClick={onChange}
            >
                <SvgIcon
                    src={checked ? CheckBox : CheckBoxOutline}
                    className="w-6 h-6"
                />
                <p className="text-text-5 text-gray-700">
                    Giữ đăng nhập
                </p>
            </div>
        </div>
    )
}

const LoginButton = ({ loading = false }) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className="transition active:scale-[0.98] cursor-pointer rounded-lg p-[10px] w-full bg-blue-800 hover:bg-yellow-500 text-white flex justify-center items-center text-h4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-800"
        >
            {loading ? (
                <ButtonLoading text="Đang đăng nhập..." size="md" color="white" />
            ) : (
                'Đăng Nhập'
            )}
        </button>
    )
}

const GoogleLoginButton = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                w-full
                cursor-pointer
                flex items-center justify-center gap-4
                rounded-lg
                border border-gray-300
                bg-white
                py-[10px]
                text-h4
                text-gray-800
                transition
                hover:bg-gray-50
                active:scale-[0.98]
            "
        >
            <SvgIcon
                src={GoogleLogo}
                className="w-6 h-6"
            />
            Đăng nhập bằng Google
        </button>
    )
}

const EmailLoginButton = ({ onClick }) => {
    return (
        <div className="w-full flex justify-end items-center text-end">
            <button
                type="button"
                onClick={onClick}
                className="
                    text-text-5
                    text-blue-800
                    hover:underline
                    hover:font-semibold
                    cursor-pointer
                    "
            >
                Đăng nhập với email
            </button>
        </div>
    )
}

const InputWithLabel = ({ label, children, showToggle, isVisible, onToggleVisibility }) => {
    return (
        <div className="w-full flex flex-col justify-center items-start gap-1">
            <div className="flex flex-row justify-between items-center w-full">
                <label className="text-h4 text-blue-800">
                    {label}
                </label>
                {showToggle && (
                    <TogglePasswordVisibility
                        isVisible={isVisible}
                        onToggle={onToggleVisibility}
                    />
                )}
            </div>
            {children}
        </div>
    )
}

const InputUserName = ({ value, onChange, error }) => {
    return (
        <InputWithLabel label="Tài khoản">
            <input
                type="text"
                name="username"
                value={value}
                onChange={onChange}
                className={`py-3 px-[10px] w-full text-start text-text-5 sm:text-text-4 text-gray-700 rounded-lg outline-1 outline-offset-[-0.50px] ${error ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-700 focus:outline-blue-800'}`}
                placeholder="Nhập tài khoản của bạn"
            />
            {error && (
                <p className="text-text-4 text-red-500 mt-1">{error}</p>
            )}
        </InputWithLabel>
    )
}

const InputPassword = ({ value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputWithLabel
            label="Mật khẩu"
            showToggle={true}
            isVisible={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
        >
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={value}
                onChange={onChange}
                className={`py-3 px-[10px] w-full text-start text-text-5 sm:text-text-4 text-gray-700 rounded-lg outline-1 outline-offset-[-0.50px] ${error ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-700 focus:outline-blue-800'}`}
                placeholder="Nhập mật khẩu của bạn"
            />
            {error && (
                <p className="text-text-4 text-red-500 mt-1">{error}</p>
            )}
        </InputWithLabel>
    )
}



function LoginForm({
    formData,
    rememberMe,
    loading = false,
    validationErrors = {},
    handleSubmit,
    handleChange,
    handleRememberMeChange
}) {
    const [showComingSoon, setShowComingSoon] = useState(false);
    const openComingSoon = () => setShowComingSoon(true);
    const closeComingSoon = () => setShowComingSoon(false);

    return (
        <div className="bg-white flex flex-col items-center justify-center w-full">
            <h1 className="w-full text-start text-h3 sm:text-h2 lg:text-h1 text-blue-800 mb-4 sm:mb-6 lg:mb-8">
                Đăng Nhập
            </h1>
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col justify-center items-center">

                <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6">
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-col justify-center items-center gap-2">
                            <div className="w-full flex flex-col justify-center items-center gap-1">
                                <EmailLoginButton onClick={openComingSoon} />

                                <div className="w-full flex flex-col justify-center items-center gap-4 sm:gap-5 lg:gap-6">
                                    <InputUserName
                                        value={formData.username}
                                        onChange={handleChange}
                                        error={validationErrors.username}
                                    />
                                    <InputPassword
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={validationErrors.password}
                                    />
                                </div>
                            </div>
                            <ForgotPasswordLink onClick={openComingSoon} />
                        </div>
                        <RememberMeCheckbox
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                    </div>
                    <LoginButton loading={loading} />
                    <div className="flex items-center w-full gap-4">
                        <div className="flex-1 h-px bg-gray-300" />

                        <p className="text-gray-700 text-text-5 whitespace-nowrap">
                            Hoặc đăng nhập bằng
                        </p>

                        <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <GoogleLoginButton onClick={openComingSoon} />
                </div>
            </form>

            <p className="mt-6 text-center text-text-5 text-gray-700">
                Nếu bạn chưa có tài khoản, hãy liên hệ với{' '}
                <span className="font-semibold text-blue-800">thầy giáo</span> hoặc{' '}
                <span className="font-semibold text-blue-800">trợ giảng</span>{' '}
                để được hỗ trợ sớm nhất.
            </p>

            <ComingSoonModal isOpen={showComingSoon} onClose={closeComingSoon} />
        </div>
    );
}

export default LoginForm;
