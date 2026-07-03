const supabase = require("../database/connection");

class VendorRepository {
    /**
     * Inserta un nuevo proveedor en la base de datos.
     *
     * @param {Object} data - Datos del proveedor
     * @returns {Promise<Object>} Proveedor creado
     */
    async create(data) {
        const payload = {
            vendor_name: data.vendor_name,
            vendor_ruc: data.vendor_ruc,
            vendor_email: data.vendor_email,
            vendor_phone: data.vendor_phone,
            vendor_address: data.vendor_address,
        };

        const { data: vendor, error } = await supabase
            .from("vendors")
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }

    /**
     * Asigna categorías a un proveedor en la tabla intermedia.
     *
     * @param {number} vendor_id - ID del proveedor
     * @param {number[]} categories - IDs de categorías
     */
    async addCategories(vendor_id, categories) {
        const records = categories.map((categoryId) => ({
            vendor_id: vendor_id,
            category_id: categoryId,
        }));

        const { error } = await supabase
            .from("vendor_categories")
            .insert(records);

        if (error) throw error;
    }

    /**
     * Lista proveedores con filtros opcionales, incluyendo categorías.
     *
     * @param {Object} [filters] - Filtros de búsqueda
     * @returns {Promise<Array>} Lista de proveedores
     */
    async findAll(filters = {}) {
        let query = supabase.from("vendors").select(`
            *,
            vendor_categories(
                category_id,
                categories(category_name)
            )
        `);

        if (filters.vendor_status)
            query = query.eq("vendor_status", filters.vendor_status);
        if (filters.vendor_email)
            query = query.eq("vendor_email", filters.vendor_email);
        if (filters.vendor_ruc)
            query = query.eq("vendor_ruc", filters.vendor_ruc);

        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * Busca un proveedor por su ID.
     *
     * @param {number} id - ID del proveedor
     * @returns {Promise<Object|null>} Proveedor o null si no existe
     */
    async findById(id) {
        console.log("findById llamado con:", id);
        if (!id) throw new Error("vendor_id es requerido");
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("vendor_id", id)
            .single();

        if (error?.code === "PGRST116") return null;
        if (error) throw error;
        return data;
    }

    /**
     * Busca un proveedor por su email.
     *
     * @param {string} vendor_email - Email del proveedor
     * @returns {Promise<Object|null>} Proveedor o null si no existe
     */
    async findByEmail(vendor_email) {
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("vendor_email", vendor_email)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async findByTaxId(vendor_ruc) {
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("vendor_ruc", vendor_ruc)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    /**
     * Actualiza parcialmente un proveedor.
     *
     * @param {number} vendor_id - ID del proveedor
     * @param {Object} data - Campos a actualizar
     * @returns {Promise<Object>} Proveedor actualizado
     */
    async update(vendor_id, data) {
        const payload = {
            updated_at: new Date(),
        };

        if (data.vendor_name !== undefined)
            payload.vendor_name = data.vendor_name;

        if (data.vendor_email !== undefined)
            payload.vendor_email = data.vendor_email;

        if (data.vendor_phone !== undefined)
            payload.vendor_phone = data.vendor_phone;

        if (data.vendor_address !== undefined)
            payload.vendor_address = data.vendor_address;

        if (data.user_id !== undefined)
            payload.user_id = data.user_id;

        const { data: vendor, error } = await supabase
            .from("vendors")
            .update(payload)
            .eq("vendor_id", vendor_id)
            .select()
            .single();

        if (error) throw error;

        return vendor;
    }

    /**
     * Actualiza el estado de un proveedor.
     *
     * @param {number} vendor_id - ID del proveedor
     * @param {string} status - Nuevo estado
     * @returns {Promise<Object>} Proveedor actualizado
     */
    async updateStatus(vendor_id, status) {
        console.log("updateStatus llamado con:", { vendor_id, status });
        const { data: vendor, error } = await supabase
            .from("vendors")
            .update({ vendor_status: status, updated_at: new Date() })
            .eq("vendor_id", vendor_id)
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }

    /**
     * Obtiene las categorías de un proveedor desde la tabla intermedia.
     *
     * @param {number} vendor_id - ID del proveedor
     * @returns {Promise<Array>} Lista de categorías
     */
    async findCategoriesByVendorId(vendor_id) {
        const { data, error } = await supabase
            .from("vendor_categories")
            .select("category_id, categories(category_name)")
            .eq("vendor_id", vendor_id);

        if (error) throw error;
        return data;
    }

    /**
     * Actualiza la URL del logotipo de un proveedor.
     *
     * @param {number} vendor_id - ID del proveedor
     * @param {string} logoUrl - URL del logotipo
     * @returns {Promise<Object>} Proveedor actualizado
     */
    async updateLogo(vendor_id, logoUrl) {
        console.log("updateLogo llamado con:", { vendor_id, logoUrl });
        const { data, error } = await supabase
            .from("vendors")
            .update({ vendor_logo_url: logoUrl, updated_at: new Date() })
            .eq("vendor_id", vendor_id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async delete(vendor_id) {
        const { error } = await supabase
            .from("vendors")
            .delete()
            .eq("vendor_id", vendor_id);

        if (error) throw error;
    }
}

module.exports = new VendorRepository();
