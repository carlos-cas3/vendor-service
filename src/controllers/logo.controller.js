const logoService = require("../services/logo.service");

class LogoController {
    async upload(req, res, next) {
        try {
            const vendor_id = parseInt(req.params.vendor_id);

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No se envió ningún archivo",
                });
            }

            const result = await logoService.uploadLogo(vendor_id, req.file);

            res.json({
                success: true,
                message: "Logo actualizado exitosamente",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LogoController();