// clients/auth.client.js
const axios = require("axios");

const AUTH_URL = process.env.AUTH_SERVICE_URL;
const SECRET = process.env.INTERNAL_SERVICE_SECRET;

const headers = {
    "x-service-secret": SECRET,
    "Content-Type": "application/json",
};

async function createUser(data) {
    try {
        const response = await axios.post(
            `${AUTH_URL}/api/admin/users/internal`,
            {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.vendor_email,
                personal_phone: data.vendor_phone,
                password: data.password,
                vendor_id: data.vendor_id,
            },
            { headers, timeout: 5000 },
        );
        return response.data; // { user_id: 99 }
    } catch (error) {
        console.error("Error creando usuario en auth-service:", error.message);
        throw error;
    }
}

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

module.exports = { createUser, updateUserStatus };
