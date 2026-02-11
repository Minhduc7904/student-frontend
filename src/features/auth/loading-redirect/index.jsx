import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfileAsync } from '../../profile/store/profileSlice';
import { ROUTES } from '../../../core/constants';
import { PageLoading } from '../../../shared/components/loading';
import { selectProfile, selectProfileLoading } from '../../profile/store/profileSlice';
import { selectIsAuthenticated } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const LoadingRedirectPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const profile = useSelector(selectProfile);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectProfileLoading);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        // Load profile
        dispatch(getProfileAsync());
    }, [isAuthenticated]);

    useEffect(() => {
        if (profile && !loading) {
            // Get the previous page from location state
            const from = location.state?.from?.pathname;

            // const rolePath = rolePathMap[profile.roleId];
            if (from) {
                navigate(from, { replace: true });
            } else {
                navigate(ROUTES.DASHBOARD, { replace: true });
            }
            // const roles = profile.roles.map((role) => role.);
        }
    }, [profile, loading]);

    return <PageLoading message="Đang tải thông tin..." />;
};

export default LoadingRedirectPage;