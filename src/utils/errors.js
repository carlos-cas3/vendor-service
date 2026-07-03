/**
 * Error base personalizado con código de estado HTTP.
 *
 * @class AppError
 * @extends {Error}
 */
class AppError extends Error {
  /**
   * @param {string} message - Descripción del error
   * @param {number} [statusCode=400] - Código de estado HTTP
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error para recursos no encontrados (HTTP 404).
 *
 * @class NotFoundError
 * @extends {AppError}
 */
class NotFoundError extends AppError {
  /**
   * @param {string} [message='Recurso no encontrado'] - Descripción del error
   */
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/**
 * Error para validación de datos (HTTP 400).
 *
 * @class ValidationError
 * @extends {AppError}
 */
class ValidationError extends AppError {
  /**
   * @param {string} [message='Error de validación'] - Descripción del error
   */
  constructor(message = 'Error de validación') {
    super(message, 400);
  }
}

/**
 * Error para autenticación/autorización fallida (HTTP 401).
 *
 * @class UnauthorizedError
 * @extends {AppError}
 */
class UnauthorizedError extends AppError {
  /**
   * @param {string} [message='No autorizado'] - Descripción del error
   */
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

/**
 * Error para conflictos por duplicados (HTTP 409).
 *
 * @class ConflictError
 * @extends {AppError}
 */
class ConflictError extends AppError {
    /**
     * @param {string} [message='El recurso ya existe'] - Descripción del error
     */
    constructor(message = 'El recurso ya existe') {
        super(message, 409);
    }
}

module.exports = { AppError, NotFoundError, ValidationError, UnauthorizedError, ConflictError };