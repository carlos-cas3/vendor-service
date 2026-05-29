const supabase = require("../database/connection");

class BranchRepository {
    /**
     * Inserta una nueva sucursal.
     *
     * @param {Object} data - Datos de la sucursal
     * @returns {Promise<Object>} Sucursal creada (con ciudad anidada)
     */
    async create(data) {
        const { data: branch, error } = await supabase
            .from("branches")
            .insert([
                {
                    vendor_id: data.vendor_id,

                    city_id: data.city_id,

                    branch_name: data.branch_name || null,

                    branch_address: data.branch_address,

                    branch_status: data.branch_status || "ACTIVE",
                },
            ])
            .select(
                `
                *,
                cities (
                    city_id,
                    city_name
                )
            `,
            )
            .single();

        if (error) throw error;

        return branch;
    }

    /**
     * Lista sucursales activas/en mantenimiento de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Lista de sucursales activas o en mantenimiento
     */
    async findActiveByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("branches")
            .select(
                `
                *,
                cities (
                    city_id,
                    city_name
                )
            `,
            )
            .eq("vendor_id", vendorId)
            .in("branch_status", ["ACTIVE", "MAINTENANCE"])
            .order("created_at", {
                ascending: true,
            });

        if (error) throw error;

        return data;
    }

    /**
     * Lista sucursales de un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Lista de sucursales (con ciudad anidada)
     */
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("branches")
            .select(
                `
                *,
                cities (
                    city_id,
                    city_name
                )
            `,
            )
            .eq("vendor_id", vendorId)
            .order("created_at", {
                ascending: true,
            });

        if (error) throw error;

        return data;
    }

    /**
     * Busca una sucursal por su ID.
     *
     * @param {number} branchId - ID de la sucursal
     * @returns {Promise<Object|null>} Sucursal o null si no existe
     */
    async findById(branchId) {
        const { data: branch, error } = await supabase
            .from("branches")
            .select(
                `
            *,
            cities (
                city_id,
                city_name
            )
        `,
            )
            .eq("branch_id", branchId)
            .single();

        if (error && error.code === "PGRST116") {
            return null;
        }

        if (error) throw error;

        return branch;
    }

    /**
     * Actualiza parcialmente una sucursal.
     *
     * @param {number} branchId - ID de la sucursal
     * @param {Object} data - Campos a actualizar
     * @returns {Promise<Object>} Sucursal actualizada
     */
    async update(branchId, data) {
        const { data: branch, error } = await supabase
            .from("branches")
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq("branch_id", branchId)
            .select(
                `
            *,
            cities (
                city_id,
                city_name
            )
        `,
            )
            .single();

        if (error) throw error;

        return branch;
    }

    /**
     * Actualiza el estado de una sucursal.
     *
     * @param {number} branchId - ID de la sucursal
     * @param {string} branchStatus - Nuevo estado
     * @returns {Promise<Object>} Sucursal actualizada
     */
    async updateStatus(branchId, branchStatus) {
        const { data: branch, error } = await supabase
            .from("branches")
            .update({
                branch_status: branchStatus,

                updated_at: new Date(),
            })
            .eq("branch_id", branchId)
            .select()
            .single();

        if (error) throw error;

        return branch;
    }

    /**
     * Desactiva una sucursal (establece estado INACTIVE).
     *
     * @param {number} branchId - ID de la sucursal
     * @returns {Promise<Object>} Sucursal desactivada
     */
    async deactivate(branchId) {
        return this.updateStatus(branchId, "INACTIVE");
    }
}

module.exports = new BranchRepository();
