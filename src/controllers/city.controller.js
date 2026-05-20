const cityRepository = require("../repositories/city.repository");

class CityController {
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