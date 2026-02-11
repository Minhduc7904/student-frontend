import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsync, selectAuthLoading, selectAuthError } from '../../store/authSlice';
import { getItem, setItem, removeItem } from '../../../../shared/utils/storage';
import { STORAGE_KEYS } from '../../../../core/constants';
import { ROUTES } from '../../../../core/constants';
/**
 * Custom hook để xử lý logic đăng nhập
 * @returns {Object} Object chứa các state và handlers cho login form
 */
export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    /**
     * Load saved credentials on mount
     */
    useEffect(() => {
        const savedCredentials = getItem(STORAGE_KEYS.REMEMBER_ME);
        if (savedCredentials && savedCredentials.username && savedCredentials.password) {
            setFormData({
                username: savedCredentials.username,
                password: savedCredentials.password
            });
            setRememberMe(true);
        }
    }, []);

    /**
     * Xử lý thay đổi input
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error khi user bắt đầu nhập
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    /**
     * Xử lý toggle remember me
     */
    const handleRememberMeChange = () => {
        setRememberMe(prev => {
            const newValue = !prev;
            // Nếu bỏ check remember me, xóa credentials đã lưu
            if (!newValue) {
                removeItem(STORAGE_KEYS.REMEMBER_ME);
            }
            return newValue;
        });
    };

    /**
     * Validate form data
     */
    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập';
        }

        if (!formData.password.trim()) {
            errors.password = 'Vui lòng nhập mật khẩu';
        }

        return errors;
    };

    /**
     * Xử lý submit form đăng nhập
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Clear errors nếu validation pass
        setValidationErrors({});

        try {
            // Dispatch login action (không truyền rememberMe)
            const resultAction = await dispatch(loginAsync({
                username: formData.username,
                password: formData.password
            }));

            // Kiểm tra kết quả
            if (loginAsync.fulfilled.match(resultAction)) {
                // Xử lý remember me - lưu hoặc xóa credentials
                if (rememberMe) {
                    // Lưu username và password vào localStorage
                    setItem(STORAGE_KEYS.REMEMBER_ME, {
                        username: formData.username,
                        password: formData.password
                    });
                } else {
                    // Xóa credentials đã lưu
                    removeItem(STORAGE_KEYS.REMEMBER_ME);
                }

                // Đăng nhập thành công, chuyển hướng
                navigate(ROUTES.LOADING_REDIRECT);
            } else if (loginAsync.rejected.match(resultAction)) {
                // Đăng nhập thất bại, error đã được xử lý trong slice
                console.error('Login failed:', resultAction.payload);
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    /**
     * Reset form về trạng thái ban đầu
     */
    const resetForm = () => {
        setFormData({
            username: '',
            password: ''
        });
        setRememberMe(false);
        setValidationErrors({});
        // Xóa credentials đã lưu
        removeItem(STORAGE_KEYS.REMEMBER_ME);
    };

    return {
        // State
        formData,
        rememberMe,
        loading,
        error,
        validationErrors,

        // Handlers
        handleChange,
        handleRememberMeChange,
        handleSubmit,
        resetForm
    };
};
