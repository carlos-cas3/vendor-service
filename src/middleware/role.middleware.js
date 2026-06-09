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
