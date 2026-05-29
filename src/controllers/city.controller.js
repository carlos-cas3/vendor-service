const cityRepository = require("../repositories/city.repository");

class CityController {
    /**
     * Lista todas las ciudades disponibles.
     *
     * @param {import('express').Request} req - Request
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * GET /api/vendors/cities
     */
    async findAll(req, res, next) {
        try {
            const cities = await cityRepository.findAll();
            res.json({ success: true, data: cities });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CityController();