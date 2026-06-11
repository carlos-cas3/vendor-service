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
            .eq("status", "ACTIVE")
            .order("created_at", { ascending: true });

        if (error) throw error;

        return data;
    }

    async findById(staffId) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .select("*")
            .eq("staff_id", staffId)
            .single();

        if (error && error.code === "PGRST116") return null;
        if (error) throw error;

        return staff;
    }

    async findByEmail(vendorId, email, excludeId) {
        let query = supabase
            .from("vendor_staff")
            .select("*")
            .eq("vendor_id", vendorId)
            .eq("email", email);

        if (excludeId) {
            query = query.neq("staff_id", excludeId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) throw error;

        return data;
    }

    async update(staffId, data) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq("staff_id", staffId)
            .select("*")
            .single();

        if (error) throw error;

        return staff;
    }

    async updateStatus(staffId, status) {
        const { data: staff, error } = await supabase
            .from("vendor_staff")
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq("staff_id", staffId)
            .select("*")
            .single();

        if (error) throw error;

        return staff;
    }
}

module.exports = new StaffRepository();
