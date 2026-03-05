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
        <div className="animate-slide-up h-full lg:w-auto w-full px-6 py-8 sm:px-10 sm:py-16 md:px-12 md:py-20 bg-white flex items-center justify-center rounded-2xl sm:rounded-3xl lg:rounded-[40px]">
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
