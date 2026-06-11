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

async function createInternalUser(data) {
    try {
        const response = await axios.post(
            `${AUTH_URL}/api/internal/users`,
            {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                personal_phone: data.personal_phone,
                role_id: data.role_id,
                vendor_id: data.vendor_id,
            },
            { headers, timeout: 5000 },
        );
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 409) {
            throw {
                code: "EMAIL_CONFLICT",
                message:
                    error.response.data?.message ||
                    "El email ya está registrado",
            };
        }
        if (error.response?.status === 400) {
            throw {
                code: "VALIDATION_ERROR",
                message:
                    error.response.data?.message || "Datos inválidos",
            };
        }
        console.error(
            "Error creando usuario interno en auth-service:",
            error.message,
        );
        throw new Error("Error en auth-service");
    }
}

async function getInternalUsers(vendorId) {
    try {
        const response = await axios.get(
            `${AUTH_URL}/api/internal/users`,
            {
                params: { vendor_id: vendorId },
                headers,
                timeout: 5000,
            },
        );
        return response.data.data;
    } catch (error) {
        console.error(
            "Error obteniendo usuarios internos:",
            error.message,
        );
        throw error;
    }
}

module.exports = {
    createUser,
    updateUserStatus,
    createInternalUser,
    getInternalUsers,
};
