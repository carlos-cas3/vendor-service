/**
 * Middleware factory que verifica que el usuario autenticado tenga uno de los roles permitidos.
 *
 * @param {number[]} allowedRoleIds - Array de role_id permitidos (ej. [2] para VENDOR_ADMIN)
 * @returns {import('express').RequestHandler} Middleware de Express
 *
 * @example
 * router.get("/staff", authMiddleware, requireRole([2]), staffController.list);
 */
function requireRole(allowedRoleIds) {
    return (req, res, next) => {
        if (!req.user?.roleId || !allowedRoleIds.includes(req.user.roleId)){ 
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para esta acción",
            });
        }
        next();
    };
}

module.exports = { requireRole };
