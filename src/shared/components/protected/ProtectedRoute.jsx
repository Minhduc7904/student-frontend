// src/shared/permissions/ProtectedRoute.js
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../../core/constants';
import { hasPermission } from '../../utils/permission';
import { selectMyProfile, selectProfileRoles, selectProfilePermissions } from '../../../features/profile/store/profileSlice';
import { selectIsAuthenticated } from '../../../features/auth/store/authSlice';

export const ProtectedRoute = ({ permission }) => {
    const location = useLocation();
    const parentOutletContext = useOutletContext();

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const userPermissions = useSelector(selectProfilePermissions);
    const userRoles = useSelector(selectProfileRoles);
    const profile = useSelector(selectMyProfile);

    // 1️⃣ Chưa đăng nhập
    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                state={{ from: location }}
                replace
            />
        );
    }

    // 2️⃣ Đã login nhưng chưa load profile
    if (!profile) {
        return (
            <Navigate
                to={ROUTES.LOADING_REDIRECT}
                state={{ from: location }}
                replace
            />
        );
    }

    // 3️⃣ Có permission requirement nhưng không đủ quyền
    if (permission && !hasPermission(userPermissions, permission, userRoles)) {
        return <Navigate to={ROUTES.FORBIDDEN} replace />;
    }

    // 4️⃣ OK → render route con
    return <Outlet context={parentOutletContext} />;
};
