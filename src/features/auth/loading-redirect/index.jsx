import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyProfileAsync } from '../../profile/store/profileSlice';
import { ROUTES } from '../../../core/constants';
import { PageLoading } from '../../../shared/components/loading';
import { selectMyProfileLoading, selectMyProfile } from '../../profile/store/profileSlice';
import { selectIsAuthenticated, clearAuth } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const LoadingRedirectPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const profile = useSelector(selectMyProfile);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectMyProfileLoading);
    const from = location.state?.from;
    const getFromPath = () => {
        if (!from) return '';
        if (typeof from === 'string') return from;

        const pathname = from.pathname || '';
        const search = from.search || '';
        const hash = from.hash || '';
        return `${pathname}${search}${hash}`;
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN, { state: { from }, replace: true });
            return;
        }

        // Load profile
        dispatch(getMyProfileAsync())
            .unwrap()
            .catch((error) => {
                // On any error (network, server, etc.), redirect to login
                console.error('Failed to load profile:', error);
                dispatch(clearAuth());
                navigate(ROUTES.LOGIN, { state: { from }, replace: true });
            });
    }, [dispatch, from, isAuthenticated, navigate]);

    useEffect(() => {
        if (profile && !loading) {
            // const rolePath = rolePathMap[profile.roleId];
            const fromPath = getFromPath();

            if (fromPath) {
                navigate(fromPath, { replace: true });
            } else {
                navigate(ROUTES.DASHBOARD, { replace: true });
            }
            // const roles = profile.roles.map((role) => role.);
        }
    }, [profile, loading, navigate]);

    return <PageLoading message="Đang tải thông tin..." />;
};

export default LoadingRedirectPage;