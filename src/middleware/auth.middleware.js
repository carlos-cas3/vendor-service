const jwt = require("jsonwebtoken");

/**
 * Verifica que el request tenga un JWT válido en el header Authorization.
 * Decodifica el token y lo asigna a req.user.
 *
 * @param {import('express').Request} req - Request
 * @param {import('express').Response} res - Response
 * @param {import('express').NextFunction} next - Next function
 * @returns {Promise<void>}
 *
 * @example
 * Authorization: Bearer <token>
 */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Token requerido" });
    }

    const token = authHeader.replace("Bearer ", "");
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({
            success: false,
            message: "JWT_SECRET no configurado",
        });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Token inválido o expirado" });
    }
}

/**
 * Verifica que el request tenga la API key interna (x-internal-key).
 *
 * @param {import('express').Request} req - Request
 * @param {import('express').Response} res - Response
 * @param {import('express').NextFunction} next - Next function
 * @returns {Promise<void>}
 *
 * @example
 * x-internal-key: <INTERNAL_SERVICE_SECRET>
 */
async function internalApiKeyMiddleware(req, res, next) {
    const apiKey = req.headers["x-internal-key"];
    const expectedKey = process.env.INTERNAL_SERVICE_SECRET;

    if (!apiKey || apiKey !== expectedKey) {
        return res
            .status(401)
            .json({ success: false, message: "API Key inválida" });
    }

    next();
}

/**
 * Verifica que el request tenga el service secret interno (x-service-secret).
 *
 * @param {import('express').Request} req - Request
 * @param {import('express').Response} res - Response
 * @param {import('express').NextFunction} next - Next function
 * @returns {void}
 *
 * @example
 * x-service-secret: <INTERNAL_SERVICE_SECRET>
 */
function serviceAuthMiddleware(req, res, next) {
    const serviceSecret = req.headers["x-service-secret"];
    const expectedSecret = process.env.INTERNAL_SERVICE_SECRET;

    if (!serviceSecret || serviceSecret !== expectedSecret) {
        return res
            .status(401)
            .json({ success: false, message: "Service secret inválido" });
    }

    next();
}

module.exports = { authMiddleware, internalApiKeyMiddleware, serviceAuthMiddleware };
