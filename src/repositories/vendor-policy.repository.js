const supabase = require("../database/connection");

class VendorPolicyRepository {
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_policies")
            .select("*")
            .eq("vendor_id", vendorId)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

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
