const { httpRequest } = require('../utils/http-client');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    const token = authHeader.replace('Bearer ', '');
    const authServiceUrl = process.env.AUTH_SERVICE_URL;

    if (!authServiceUrl) {
      return res.status(500).json({ success: false, message: 'AUTH_SERVICE_URL no configurado' });
    }

    const { status, data } = await httpRequest(
      `${authServiceUrl}/api/auth/verify`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      }
    );

    if (status !== 200 || !data?.user) {
      return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }

    req.user = data.user;
    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Servicio de autenticación no disponible',
    });
  }
}

async function internalApiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-internal-key'];
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ success: false, message: 'API Key inválida' });
  }

  next();
}

module.exports = { authMiddleware, internalApiKeyMiddleware };
