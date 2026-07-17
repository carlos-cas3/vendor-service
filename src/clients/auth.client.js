// clients/auth.client.js
const axios = require("axios");

const AUTH_URL = process.env.AUTH_SERVICE_URL;
const SECRET = process.env.INTERNAL_SERVICE_SECRET;

const headers = {
    "x-service-secret": SECRET,
    "Content-Type": "application/json",
};

/**
 * Crea un usuario en auth-service para el registro de vendor.
 *
 * @param {{ first_name: string, last_name: string, vendor_email: string, vendor_phone?: string, vendor_id: number }} data - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 * @throws {Error} Si el auth-service no responde
 */
async function createUser(data) {
    try {
        const response = await axios.post(
            `${AUTH_URL}/api/admin/users/internal`,
            {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.vendor_email,
                personal_phone: data.vendor_phone,
                vendor_id: data.vendor_id,
            },
            { headers, timeout: 5000 },
        );
        return response.data.data;
    } catch (error) {
        console.error("Error creando usuario en auth-service:", error.message);
        throw error;
    }
}

/**
 * Actualiza el estado de un usuario en auth-service.
 *
 * @param {number} user_id - ID del usuario en auth-service
 * @param {string} status - Nuevo estado (ACTIVE, INACTIVE)
 * @returns {Promise<void>}
 * @throws {Error} Si el auth-service no responde
 */
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

/**
 * Crea un usuario interno (staff) en auth-service.
 *
 * @param {{ first_name: string, last_name: string, email: string, personal_phone?: string, role_id: number, vendor_id: number }} data - Datos del staff
 * @returns {Promise<Object>} Usuario creado con user_id
 * @throws {{ code: string, message: string }} Si hay conflicto de email (409) o datos inválidos (400)
 */
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

/**
 * Obtiene usuarios internos de auth-service por vendor_id.
 *
 * @param {number} vendorId - ID del vendor
 * @returns {Promise<Array>} Lista de usuarios internos
 * @throws {Error} Si el auth-service no responde
 */
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

/**
 * Actualiza un usuario en auth-service por microservicio interno.
 *
 * @param {number} userId - ID del usuario en auth-service
 * @param {{ first_name?: string, last_name?: string, email?: string, personal_phone?: string }} data - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 * @throws {Error} Si el auth-service no responde
 */
async function updateUser(userId, data) {
    const response = await axios.patch(
        `${AUTH_URL}/api/ms/users/${userId}`,
        {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            personal_phone: data.personal_phone,
        },
        { headers, timeout: 5000 },
    );
    return response.data.data;
}

/**
 * Actualiza el rol de un usuario en auth-service.
 *
 * @param {number} userId - ID del usuario en auth-service
 * @param {number} role_id - Nuevo role_id
 * @returns {Promise<void>}
 * @throws {Error} Si el auth-service no responde
 */
async function updateUserRole(userId, role_id) {
    await axios.patch(
        `${AUTH_URL}/api/ms/users/${userId}/role`,
        { role_id },
        { headers, timeout: 5000 },
    );
}

module.exports = {
    createUser,
    updateUserStatus,
    createInternalUser,
    getInternalUsers,
    updateUser,
    updateUserRole,
};
