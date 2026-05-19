const supabase = require("../database/connection");

class PaymentMethodRepository {
    async findAll() {
        const { data, error } = await supabase
            .from("payment_methods")
            .select("*")
            .order("payment_method_name", { ascending: true });

        if (error) throw error;

        return data;
    }

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

    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_payment_methods")
            .select("payment_methods(*)")
            .eq("vendor_id", vendorId);

        if (error) throw error;
        return data.map((item) => item.payment_methods);
    }

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
