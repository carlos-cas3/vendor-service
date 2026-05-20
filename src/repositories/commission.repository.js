const supabase = require("../database/connection");

class CommissionRepository {
    async create(data) {
        const { data: config, error } = await supabase
            .from("commission_config")
            .insert([
                {
                    vendor_id: data.vendor_id,
                    commission_rate: data.commission_rate,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return config;
    }

    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("commission_config")
            .select("*")
            .eq("vendor_id", vendorId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async findById(id) {
        const { data, error } = await supabase
            .from("commission_config")
            .select("*")
            .eq("config_id", id)
            .single();

        if (error && error.code === "PGRST116") return null;
        if (error) throw error;
        return data;
    }

    async update(id, commission_rate) {
        const { data: config, error } = await supabase
            .from("commission_config")
            .update({
                commission_rate,
                updated_at: new Date(),
            })
            .eq("config_id", id)
            .select()
            .single();

        if (error) throw error;
        return config;
    }

    async delete(id) {
        const { error } = await supabase
            .from("commission_config")
            .delete()
            .eq("config_id", id);

        if (error) throw error;
        return true;
    }
}

module.exports = new CommissionRepository();
