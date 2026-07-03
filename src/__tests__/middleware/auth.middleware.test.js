const jwt = require("jsonwebtoken");
const {
  authMiddleware,
  internalApiKeyMiddleware,
  serviceAuthMiddleware,
} = require("../../middleware/auth.middleware");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    delete process.env.JWT_SECRET;
  });

  it("rechaza request sin header Authorization", async () => {
    // Arrange
    req.headers = {};
    // Act
    await authMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token requerido",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza request sin prefijo Bearer", async () => {
    // Arrange
    req.headers.authorization = "TokenInvalido";
    // Act
    await authMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token requerido",
    });
  });

  it("responde 500 si JWT_SECRET no está configurado", async () => {
    // Arrange
    process.env.JWT_SECRET = "";
    req.headers.authorization = "Bearer token-cualquiera";
    // Act
    await authMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "JWT_SECRET no configurado",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza token inválido", async () => {
    // Arrange
    process.env.JWT_SECRET = "mi-secreto";
    req.headers.authorization = "Bearer token-invalido";
    // Act
    await authMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token inválido o expirado",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("acepta token válido y asigna req.user", async () => {
    // Arrange
    process.env.JWT_SECRET = "mi-secreto";
    const payload = { userId: 1, roleId: 2, vendorId: 1 };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    req.headers.authorization = `Bearer ${token}`;
    // Act
    await authMiddleware(req, res, next);
    // Assert
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(payload);
  });
});

describe("internalApiKeyMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.INTERNAL_SERVICE_SECRET = "secret-key";
  });

  it("rechaza request sin x-internal-key", async () => {
    // Arrange
    req.headers = {};
    // Act
    await internalApiKeyMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "API Key inválida",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza x-internal-key incorrecta", async () => {
    // Arrange
    req.headers["x-internal-key"] = "wrong-key";
    // Act
    await internalApiKeyMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("acepta x-internal-key correcta", async () => {
    // Arrange
    req.headers["x-internal-key"] = "secret-key";
    // Act
    await internalApiKeyMiddleware(req, res, next);
    // Assert
    expect(next).toHaveBeenCalled();
  });
});

describe("serviceAuthMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.INTERNAL_SERVICE_SECRET = "service-secret";
  });

  it("rechaza request sin x-service-secret", () => {
    // Arrange
    req.headers = {};
    // Act
    serviceAuthMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Service secret inválido",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza x-service-secret incorrecto", () => {
    // Arrange
    req.headers["x-service-secret"] = "wrong-secret";
    // Act
    serviceAuthMiddleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("acepta x-service-secret correcto", () => {
    // Arrange
    req.headers["x-service-secret"] = "service-secret";
    // Act
    serviceAuthMiddleware(req, res, next);
    // Assert
    expect(next).toHaveBeenCalled();
  });
});
