const crypto = require("crypto");

function generateTempPassword() {
    return crypto
        .randomBytes(8)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10);
}

module.exports = { generateTempPassword };
