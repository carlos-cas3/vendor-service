const crypto = require("crypto");

/**
 * Genera una contraseña temporal aleatoria de 10 caracteres alfanuméricos.
 *
 * @returns {string} Contraseña temporal
 *
 * @example
 * const pwd = generateTempPassword(); // "a3Kf9xL2pQ"
 */
function generateTempPassword() {
    return crypto
        .randomBytes(8)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10);
}

module.exports = { generateTempPassword };
