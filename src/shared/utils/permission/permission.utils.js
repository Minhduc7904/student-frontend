// src/shared/permissions/permission.utils.js
import { ROLE_NAMES } from '../../../core/constants/role/role.constants';

export const hasPermission = (
    userPermissions = [],
    required,
    userRoles = []
) => {
    // 1️⃣ SUPER ADMIN → full quyền
    const isSuperAdmin = userRoles.some(
        (role) => role.roleName === ROLE_NAMES.SUPER_ADMIN
    );
    if (isSuperAdmin) return true;

    // 2️⃣ Không yêu cầu permission
    if (!required) return true;

    // 3️⃣ Không có permission list
    if (!Array.isArray(userPermissions)) return false;

    // 4️⃣ Required là mảng → phải có đủ
    if (Array.isArray(required)) {
        return required.every((p) => userPermissions.includes(p));
    }

    // 5️⃣ Required là string
    return userPermissions.includes(required);
};
