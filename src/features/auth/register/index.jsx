import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GoogleLogo from '../../../assets/icons/GoogleLogo.svg';
import { ROUTES, STORAGE_KEYS } from '../../../core/constants';
import { authService } from '../../../core/services/modules/authService';
import { SvgIcon, ButtonLoading } from '../../../shared/components';
import { getItem, setItem } from '../../../shared/utils/storage';
import {
    loginAsync,
    registerAsync,
    selectAuthError,
    selectAuthLoading,
    selectIsAuthenticated,
} from '../store/authSlice';

const createInitialForm = () => ({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    studentPhone: '',
    parentPhone: '',
    school: '',
    highSchoolGraduationYear: '',
    grade: '',
});

const buildDeviceFingerprint = () => {
    const existingFingerprint = getItem(STORAGE_KEYS.DEVICE_ID);
    if (existingFingerprint) return existingFingerprint;

    const fingerprint = `web-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
    setItem(STORAGE_KEYS.DEVICE_ID, fingerprint);
    return fingerprint;
};

const buildLoginPayload = ({ username, email, password }) => {
    const identity = username.trim() || email.trim();
    const identityKey = identity.includes('@') ? 'email' : 'username';

    return {
        [identityKey]: identity,
        password,
        deviceFingerprint: buildDeviceFingerprint(),
        userAgent: navigator.userAgent,
    };
};

const sanitizeRegisterPayload = (formData) => {
    const payload = {
        username: formData.username.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        grade: Number(formData.grade),
    };

    const optionalStringFields = [
        'email',
        'gender',
        'dateOfBirth',
        'studentPhone',
        'parentPhone',
        'school',
    ];

    optionalStringFields.forEach((field) => {
        const value = formData[field]?.trim();
        if (value) payload[field] = value;
    });

    if (formData.highSchoolGraduationYear) {
        payload.highSchoolGraduationYear = Number(formData.highSchoolGraduationYear);
    }

    return payload;
};

const fieldClass = (error) => (
    `mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${
        error
            ? 'border-red-500 focus:ring-red-100'
            : 'border-blue-100 focus:border-blue-800 focus:ring-blue-100'
    }`
);

const TextField = ({ label, name, value, onChange, error, type = 'text', required = false, placeholder = '' }) => (
    <label className="block">
        <span className="text-sm font-680 text-blue-950">
            {label}
            {required ? <span className="text-red-500"> *</span> : null}
        </span>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={fieldClass(error)}
        />
        {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
);

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);
    const [formData, setFormData] = useState(createInitialForm);
    const [validationErrors, setValidationErrors] = useState({});

    const gradeOptions = useMemo(
        () => Array.from({ length: 12 }, (_, index) => index + 1),
        []
    );

    if (isAuthenticated) {
        return <Navigate to={ROUTES.LOADING_REDIRECT} state={{ from: location.state?.from }} replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((current) => ({ ...current, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.username.trim()) errors.username = 'Vui lòng nhập tên đăng nhập';
        if (!formData.firstName.trim()) errors.firstName = 'Vui lòng nhập tên';
        if (!formData.lastName.trim()) errors.lastName = 'Vui lòng nhập họ';
        if (!formData.grade) errors.grade = 'Vui lòng chọn khối';
        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Mật khẩu cần tối thiểu 6 ký tự';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận chưa khớp';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email chưa đúng định dạng';
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});
        const registerAction = await dispatch(registerAsync(sanitizeRegisterPayload(formData)));
        if (!registerAsync.fulfilled.match(registerAction)) return;

        const loginAction = await dispatch(loginAsync(buildLoginPayload(formData)));
        if (loginAsync.fulfilled.match(loginAction)) {
            navigate(ROUTES.LOADING_REDIRECT, {
                state: { from: location.state?.from },
                replace: true,
            });
        }
    };

    const handleGoogleRegister = () => {
        window.location.assign(authService.getGoogleStudentUrl());
    };

    return (
        <div className="animate-slide-up w-full max-w-3xl rounded-3xl bg-white px-5 py-6 shadow-[0_24px_70px_rgba(15,37,82,0.14)] sm:px-8 sm:py-8">
            <div className="mb-6">
                <p className="text-sm font-680 text-blue-800">Tài khoản học sinh</p>
                <h1 className="mt-2 text-h2 text-blue-950">Đăng ký học online</h1>
                <p className="mt-2 text-sm text-gray-subtle">
                    Tạo tài khoản Student để học thử, đăng ký khóa học và theo dõi tiến độ.
                </p>
            </div>

            <button
                type="button"
                onClick={handleGoogleRegister}
                className="mb-5 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-680 text-gray-800 transition hover:bg-blue-50 active:scale-[0.99]"
            >
                <SvgIcon src={GoogleLogo} className="h-5 w-5" />
                Tiếp tục với Google
            </button>

            <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-blue-100" />
                <span className="text-xs font-680 text-gray-subtle">hoặc đăng ký bằng thông tin</span>
                <span className="h-px flex-1 bg-blue-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        label="Tên đăng nhập"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={validationErrors.username}
                        required
                        placeholder="nguyen.van.a"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={validationErrors.email}
                        placeholder="student@example.com"
                    />
                    <TextField
                        label="Tên"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={validationErrors.firstName}
                        required
                    />
                    <TextField
                        label="Họ"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={validationErrors.lastName}
                        required
                    />
                    <TextField
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={validationErrors.password}
                        required
                    />
                    <TextField
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={validationErrors.confirmPassword}
                        required
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block">
                        <span className="text-sm font-680 text-blue-950">
                            Khối <span className="text-red-500">*</span>
                        </span>
                        <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className={fieldClass(validationErrors.grade)}
                        >
                            <option value="">Chọn khối</option>
                            {gradeOptions.map((grade) => (
                                <option key={grade} value={grade}>
                                    Khối {grade}
                                </option>
                            ))}
                        </select>
                        {validationErrors.grade ? <span className="mt-1 block text-xs text-red-600">{validationErrors.grade}</span> : null}
                    </label>
                    <label className="block">
                        <span className="text-sm font-680 text-blue-950">Giới tính</span>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={fieldClass()}
                        >
                            <option value="">Không chọn</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </label>
                    <TextField
                        label="Ngày sinh"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Số điện thoại học sinh" name="studentPhone" value={formData.studentPhone} onChange={handleChange} />
                    <TextField label="Số điện thoại phụ huynh" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
                    <TextField label="Trường học" name="school" value={formData.school} onChange={handleChange} />
                    <TextField
                        label="Năm tốt nghiệp THPT"
                        name="highSchoolGraduationYear"
                        type="number"
                        value={formData.highSchoolGraduationYear}
                        onChange={handleChange}
                        placeholder="2028"
                    />
                </div>

                {authError ? (
                    <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {authError}
                    </p>
                ) : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-blue-800 px-4 py-3 text-h4 text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? <ButtonLoading text="Đang tạo tài khoản..." size="md" color="white" /> : 'Tạo tài khoản'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-700">
                Đã có tài khoản?{' '}
                <Link to={ROUTES.LOGIN} className="font-680 text-blue-800 hover:underline">
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}

export default RegisterPage;
