// src/shared/hooks/permissions/useHasPermission.js
import { useSelector } from 'react-redux';
import { selectProfilePermissions, selectProfileRoles } from '../../../features/profile/store/profileSlice';
import { hasPermission } from '../../utils/permission';

export const useHasPermission = (permission) => {
    const permissions = useSelector(selectProfilePermissions);
    const roles = useSelector(selectProfileRoles);
    return hasPermission(permissions, permission, roles);
};
