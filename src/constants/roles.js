/**
 * Constantes de roles del sistema.
 * @type {{ SUPER_ADMIN: number, VENDOR_ADMIN: number, SUPERVISOR: number, SELLER: number }}
 *
 * @example
 * const ROLES = require("./constants/roles");
 * if (roleId === ROLES.VENDOR_ADMIN) { ... }
 */
const ROLES = {
    SUPER_ADMIN: 1,
    VENDOR_ADMIN: 2,
    SUPERVISOR: 4,
    SELLER: 3,
};

module.exports = ROLES;
