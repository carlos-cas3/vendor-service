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
}

module.exports = new StaffController();
