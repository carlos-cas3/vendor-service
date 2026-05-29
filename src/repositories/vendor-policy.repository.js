const supabase = require("../database/connection");

class VendorPolicyRepository {
    /**
     * Obtiene la política de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Object|null>} Política o null
     */
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_policies")
            .select("*")
            .eq("vendor_id", vendorId)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    /**
     * Crea o actualiza la política de un proveedor (upsert).
     *
     * @param {number} vendorId - ID del proveedor
     * @param {string} description - Descripción de la política
     * @returns {Promise<Object>} Política guardada
     */
    async upsert(vendorId, description) {
        const { data, error } = await supabase
            .from("vendor_policies")
            .upsert(
                {
                    vendor_id: vendorId,
                    return_policy_description: description,
                    updated_at: new Date(),
                },
                { onConflict: "vendor_id" },
            )
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new VendorPolicyRepository();
