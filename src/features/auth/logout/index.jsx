import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { PageLoading } from '../../../shared/components/loading';
import { logoutAsync } from '../store/authSlice';

const LogoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        if (hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;

        const performLogout = async () => {
            try {
                await dispatch(logoutAsync()).unwrap();
            } catch {
                // Even if API logout fails, local auth is cleared in slice.
            } finally {
                navigate(ROUTES.LOGIN, { replace: true });
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    return <PageLoading message="Đang đăng xuất..." />;
};

export default LogoutPage;
