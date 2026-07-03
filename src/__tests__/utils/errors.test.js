const {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
} = require("../../utils/errors");

describe("AppError", () => {
  it("tiene name como AppError", () => {
    // Arrange
    const err = new AppError("Algo salió mal", 400);
    // Act
    // Assert
    expect(err.name).toBe("AppError");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Algo salió mal");
    expect(err.isOperational).toBe(true);
  });

  it("usa 400 como statusCode por defecto", () => {
    // Arrange
    const err = new AppError("test");
    // Act
    // Assert
    expect(err.statusCode).toBe(400);
  });
});

describe("NotFoundError", () => {
  it("tiene name NotFoundError y statusCode 404", () => {
    // Arrange
    const err = new NotFoundError();
    // Act
    // Assert
    expect(err.name).toBe("NotFoundError");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Recurso no encontrado");
  });

  it("acepta mensaje personalizado", () => {
    // Arrange
    const err = new NotFoundError("Proveedor no encontrado");
    // Act
    // Assert
    expect(err.message).toBe("Proveedor no encontrado");
  });
});

describe("ValidationError", () => {
  it("tiene name ValidationError y statusCode 400", () => {
    // Arrange
    const err = new ValidationError();
    // Act
    // Assert
    expect(err.name).toBe("ValidationError");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Error de validación");
  });

  it("acepta mensaje personalizado", () => {
    // Arrange
    const err = new ValidationError("vendor_name es requerido");
    // Act
    // Assert
    expect(err.message).toBe("vendor_name es requerido");
  });
});

describe("UnauthorizedError", () => {
  it("tiene name UnauthorizedError y statusCode 401", () => {
    // Arrange
    const err = new UnauthorizedError();
    // Act
    // Assert
    expect(err.name).toBe("UnauthorizedError");
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("No autorizado");
  });
});

describe("ConflictError", () => {
  it("tiene name ConflictError y statusCode 409", () => {
    // Arrange
    const err = new ConflictError();
    // Act
    // Assert
    expect(err.name).toBe("ConflictError");
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe("El recurso ya existe");
  });

  it("acepta mensaje personalizado", () => {
    // Arrange
    const err = new ConflictError("El email ya está registrado");
    // Act
    // Assert
    expect(err.message).toBe("El email ya está registrado");
  });
});
