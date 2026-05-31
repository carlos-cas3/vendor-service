// clients/auth.client.js
const axios = require("axios");

const AUTH_URL = process.env.AUTH_SERVICE_URL;
const SECRET = process.env.INTERNAL_SERVICE_SECRET;

const headers = {
    "x-service-secret": SECRET,
    "Content-Type": "application/json",
};

async function updateUserStatus(user_id, status) {
    try {
        await axios.patch(
            `${AUTH_URL}/api/admin/users/${user_id}/status`,
            { status },
            { headers, timeout: 5000 },
        );
    } catch (error) {
        console.error("Error notificando auth-service:", error.message);
        throw error;
    }
}

module.exports = { updateUserStatus };
