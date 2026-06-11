const jwt = require("jsonwebtoken");

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

module.exports = { authMiddleware, internalApiKeyMiddleware };
