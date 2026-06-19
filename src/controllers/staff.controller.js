const Joi = require("joi");
const staffService = require("../services/staff.service");
const { ValidationError } = require("../utils/errors");
const ROLES = require("../constants/roles");

const createStaffSchema = Joi.object({
    first_name: Joi.string().trim().min(1).max(100).required(),
    last_name: Joi.string().trim().min(1).max(100).required(),
    email: Joi.string().email().required(),
    personal_phone: Joi.string().trim().max(20).optional().allow(""),
    role_id: Joi.number()
        .valid(ROLES.SUPERVISOR, ROLES.SELLER)
        .required(),
});

const updateStaffSchema = Joi.object({
    first_name: Joi.string().trim().min(1).max(100).optional(),
    last_name: Joi.string().trim().min(1).max(100).optional(),
    email: Joi.string().email().optional(),
    personal_phone: Joi.string().trim().max(20).optional().allow(""),
    availability_status: Joi.string()
        .valid("available", "unavailable")
        .optional(),
}).min(1);

const staffIdParamSchema = Joi.object({
    staff_id: Joi.number().integer().positive().required(),
});

class StaffController {
    /**
     * Crea un nuevo miembro del staff para el vendor autenticado.
     *
     * @param {import('express').Request} req - Request con datos del staff en body (first_name, last_name, email, role_id)
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {ValidationError} Si los datos no pasan la validación de Joi
     * @throws {ConflictError} Si el email ya está registrado
     *
     * @example
     * POST /api/vendors/staff
     * { "first_name": "Juan", "last_name": "Pérez", "email": "juan@ejemplo.com", "role_id": 3 }
     */
    async create(req, res, next) {
        try {
            const { error, value } = createStaffSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                const messages = error.details
                    .map((d) => d.message)
                    .join("; ");
                throw new ValidationError(messages);
            }

            const vendor_id = req.user.vendorId;

            const result = await staffService.createStaff(value, vendor_id);

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista el staff activo del vendor autenticado.
     *
     * @param {import('express').Request} req - Request (req.user.vendorId)
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors/staff
     */
    async list(req, res, next) {
        try {
            const vendor_id = req.user.vendorId;

            const result = await staffService.getStaff(vendor_id);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene un miembro del staff por ID.
     *
     * @param {import('express').Request} req - Request con staff_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {ValidationError} Si staff_id no es válido
     * @throws {NotFoundError} Si el staff no existe o no pertenece al vendor
     *
     * @example
     * GET /api/vendors/staff/1
     */
    async findById(req, res, next) {
        try {
            const { error, value } = staffIdParamSchema.validate(
                req.params,
                { abortEarly: false },
            );

            if (error) {
                const messages = error.details
                    .map((d) => d.message)
                    .join("; ");
                throw new ValidationError(messages);
            }

            const vendor_id = req.user.vendorId;

            const result = await staffService.getStaffById(
                value.staff_id,
                vendor_id,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza un miembro del staff.
     *
     * @param {import('express').Request} req - Request con staff_id en params y datos en body
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {ValidationError} Si los parámetros o body no pasan validación
     * @throws {NotFoundError} Si el staff no existe
     * @throws {ConflictError} Si el email ya está registrado para otro staff del mismo vendor
     *
     * @example
     * PATCH /api/vendors/staff/1
     * { "first_name": "Juan Actualizado", "availability_status": "unavailable" }
     */
    async update(req, res, next) {
        try {
            const { error: paramsError, value: params } =
                staffIdParamSchema.validate(req.params, {
                    abortEarly: false,
                });

            if (paramsError) {
                const messages = paramsError.details
                    .map((d) => d.message)
                    .join("; ");
                throw new ValidationError(messages);
            }

            const { error: bodyError, value } =
                updateStaffSchema.validate(req.body, {
                    abortEarly: false,
                    stripUnknown: true,
                });

            if (bodyError) {
                const messages = bodyError.details
                    .map((d) => d.message)
                    .join("; ");
                throw new ValidationError(messages);
            }

            const vendor_id = req.user.vendorId;

            const result = await staffService.updateStaff(
                params.staff_id,
                vendor_id,
                value,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Desactiva (borrado lógico) un miembro del staff.
     *
     * @param {import('express').Request} req - Request con staff_id en params
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {ValidationError} Si staff_id no es válido
     * @throws {NotFoundError} Si el staff no existe
     *
     * @example
     * DELETE /api/vendors/staff/1
     */
    async deactivate(req, res, next) {
        try {
            const { error, value } = staffIdParamSchema.validate(
                req.params,
                { abortEarly: false },
            );

            if (error) {
                const messages = error.details
                    .map((d) => d.message)
                    .join("; ");
                throw new ValidationError(messages);
            }

            const vendor_id = req.user.vendorId;

            const result = await staffService.deactivateStaff(
                value.staff_id,
                vendor_id,
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista staff por vendor_id (inter-service, sin auth de usuario).
     *
     * @param {import('express').Request} req - Request con vendor_id en query
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @throws {ValidationError} Si vendor_id no está presente
     *
     * @example
     * GET /api/internal/staff?vendor_id=1
     */
    async listInternal(req, res, next) {
        try {
            const vendor_id = parseInt(req.query.vendor_id);
            if (!vendor_id) {
                throw new ValidationError("vendor_id es requerido");
            }

            const result = await staffService.getStaff(vendor_id);

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StaffController();
