const supabase = require("../database/connection");

class PaymentMethodRepository {
    /**
     * Lista todos los métodos de pago disponibles.
     *
     * @returns {Promise<Array>} Lista de métodos de pago
     */
    async findAll() {
        const { data, error } = await supabase
            .from("payment_methods")
            .select("*")
            .order("payment_method_name", { ascending: true });

        if (error) throw error;

        return data;
    }

    /**
     * Busca un método de pago por su ID.
     *
     * @param {number} id - ID del método de pago
     * @returns {Promise<Object|null>} Método de pago o null
     */
    async findById(id) {
        const { data, error } = await supabase
            .from("payment_methods")
            .select("*")
            .eq("payment_method_id", id)
            .single();

        if (error && error.code === "PGRST116") return null;
        if (error) throw error;
        return data;
    }

    /**
     * Obtiene los métodos de pago asignados a un proveedor.
     *
     * @param {number} vendorId - ID del proveedor
     * @returns {Promise<Array>} Métodos de pago del proveedor
     */
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_payment_methods")
            .select("payment_methods(*)")
            .eq("vendor_id", vendorId);

        if (error) throw error;
        return data.map((item) => item.payment_methods);
    }

    /**
     * Reemplaza los métodos de pago de un proveedor.
     * Elimina los existentes e inserta los nuevos.
     *
     * @param {number} vendorId - ID del proveedor
     * @param {number[]} paymentMethodIds - IDs de métodos de pago
     * @returns {Promise<Array>} Registros creados
     */
    async replaceVendorPaymentMethods(vendorId, paymentMethodIds) {
        // eliminar actuales
        const { error: deleteError } = await supabase
            .from("vendor_payment_methods")
            .delete()
            .eq("vendor_id", vendorId);

        if (deleteError) throw deleteError;

        // si no hay métodos seleccionados
        if (!paymentMethodIds.length) {
            return [];
        }

        // crear nuevas relaciones
        const rows = paymentMethodIds.map((paymentMethodId) => ({
            vendor_id: vendorId,
            payment_method_id: paymentMethodId,
        }));

        const { data, error } = await supabase
            .from("vendor_payment_methods")
            .insert(rows)
            .select();

        if (error) throw error;

        return data;
    }
}

module.exports = new PaymentMethodRepository();
