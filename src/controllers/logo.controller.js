const logoService = require("../services/logo.service");

class LogoController {
    /**
     * Sube un logotipo para un proveedor.
     * Acepta archivos PNG o JPG de hasta 2MB vía multipart/form-data.
     *
     * @param {import('express').Request} req - Request con vendor_id en params y archivo "logo" en file
     * @param {import('express').Response} res - Response
     * @param {import('express').NextFunction} next - Next function
     * @returns {Promise<void>}
     *
     * @example
     * POST /api/vendors/1/logo
     * (multipart/form-data con campo "logo")
     */
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