const supabase = require("../database/connection");
const vendorRepository = require("../repositories/vendor.repository");

class LogoService {
    /**
     * Sube un logotipo para un proveedor a Supabase Storage.
     * Elimina el logotipo anterior si existe y actualiza la URL en la base de datos.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {Object} file - Archivo de imagen (de multer)
     * @param {string} file.mimetype - Tipo MIME del archivo
     * @param {Buffer} file.buffer - Contenido del archivo
     * @returns {Promise<Object>} Objeto con logo_url
     * @throws {Error} Si la subida falla
     *
     * @example
     * const result = await logoService.uploadLogo(1, req.file);
     * // { logo_url: "https://.../logo_photos/vendors/1/logo.png?t=1234567890" }
     */
    async uploadLogo(vendorId, file) {
        const ext = file.mimetype === "image/png" ? "png" : "jpg";
        const filePath = `vendors/${vendorId}/logo.${ext}`;

        // Elimina el archivo anterior si existe
        const { error: removeError } = await supabase.storage
            .from("logo_photos")
            .remove([filePath]);
        console.log("remove result:", removeError ?? "eliminado ok");

        // Sube el nuevo
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("logo_photos")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
            });

        console.log("upload result:", { uploadData, uploadError });

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage
            .from("logo_photos")
            .getPublicUrl(filePath);

        const logoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        const updatedVendor = await vendorRepository.updateLogo(
            vendorId,
            logoUrl,
        );
        console.log("vendor actualizado:", updatedVendor);

        return { logo_url: logoUrl };
    }
}

module.exports = new LogoService();
