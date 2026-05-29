const supabase = require("../database/connection");

class CategoryRepository {
    /**
     * Lista todas las categorías disponibles.
     *
     * @returns {Promise<Array>} Lista de categorías
     */
    async findAll() {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("category_name", { ascending: true });

        if (error) throw error;

        return data;
    }

    /**
     * Busca una categoría por su ID.
     *
     * @param {number} categoryId - ID de la categoría
     * @returns {Promise<Object|null>} Categoría o null
     */
    async findById(categoryId) {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("category_id", categoryId)
            .single();

        if (error && error.code === "PGRST116") {
            return null;
        }

        if (error) throw error;

        return data;
    }

    /**
     * Obtiene las categorías asignadas a un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Categorías del proveedor
     */
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_categories")
            .select(
                `
            categories (
                category_id,
                category_name
            )
        `,
            )
            .eq("vendor_id", vendorId);

        if (error) throw error;

        return data;
    }

    /**
     * Asigna una categoría a un proveedor (upsert).
     *
     * @param {number} vendorId - ID del proveedor
     * @param {number} categoryId - ID de la categoría
     * @returns {Promise<Object>} Registro creado
     */
    async assignToVendor(vendorId, categoryId) {
        const { data, error } = await supabase
            .from("vendor_categories")
            .upsert(
                {
                    vendor_id: vendorId,
                    category_id: categoryId,
                },
                {
                    onConflict: "vendor_id,category_id",
                },
            )
            .select()
            .single();

        if (error) throw error;

        return data;
    }

    /**
     * Elimina una categoría de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {number} categoryId - ID de la categoría
     * @returns {Promise<boolean>} true si se eliminó
     */
    async removeFromVendor(vendorId, categoryId) {
        const { error } = await supabase
            .from("vendor_categories")
            .delete()
            .eq("vendor_id", vendorId)
            .eq("category_id", categoryId);

        if (error) throw error;

        return true;
    }

    /**
     * Reemplaza todas las categorías de un proveedor.
     * Elimina las existentes e inserta las nuevas.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {number[]} categoryIds - IDs de categorías
     * @returns {Promise<Array>} Registros creados
     */
    async replaceVendorCategories(vendorId, categoryIds) {
        await supabase
            .from("vendor_categories")
            .delete()
            .eq("vendor_id", vendorId);

        if (categoryIds.length === 0) {
            return [];
        }

        const rows = categoryIds.map((categoryId) => ({
            vendor_id: vendorId,
            category_id: categoryId,
        }));

        const { data, error } = await supabase
            .from("vendor_categories")
            .insert(rows)
            .select();

        if (error) throw error;

        return data;
    }
}

module.exports = new CategoryRepository();
