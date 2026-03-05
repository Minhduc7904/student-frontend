import LoginForm from './components/LoginForm';
import { useLogin } from './hooks';

function LoginPage() {
    const {
        formData,
        rememberMe,
        loading,
        validationErrors,
        handleChange,
        handleRememberMeChange,
        handleSubmit
    } = useLogin();

    return (
        <div className="animate-slide-up h-full lg:w-125 w-full px-6 pt-8 pb-6 sm:px-10 sm:pt-16 sm:pb-10 md:px-12 md:pt-20 md:pb-12 bg-white flex items-center justify-center rounded-2xl sm:rounded-3xl lg:rounded-[36px]">
            <LoginForm
                formData={formData}
                rememberMe={rememberMe}
                loading={loading}
                validationErrors={validationErrors}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleRememberMeChange={handleRememberMeChange}
            />
        </div>
    );
}

export default LoginPage;
