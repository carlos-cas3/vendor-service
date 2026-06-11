const supabase = require("../database/connection");

class StaffRepository {
    async create(data) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .insert([
                {
                    user_id: data.user_id,
                    vendor_id: data.vendor_id,
                    role_id: data.role_id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    personal_phone: data.personal_phone || null,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return staff;
    }

    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_staff")
            .select("*")
            .eq("vendor_id", vendorId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return data;
    }
}

module.exports = new StaffRepository();
