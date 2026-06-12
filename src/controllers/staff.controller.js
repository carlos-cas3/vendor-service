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

    async list(req, res, next) {
        try {
            const vendor_id = req.user.vendorId;

            const result = await staffService.getStaff(vendor_id);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

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
