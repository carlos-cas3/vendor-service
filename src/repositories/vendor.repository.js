const supabase = require("../database/connection");

class VendorRepository {
    async create(data) {
        const payload = {
            vendor_name: data.vendor_name,
            vendor_ruc: data.vendor_ruc,
            vendor_email: data.vendor_email,
            vendor_phone: data.vendor_phone,
            vendor_address: data.vendor_address,
            user_id: data.user_id,
        };

        const { data: vendor, error } = await supabase
            .from("vendors")
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }

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

    async findById(id) {
        console.log("findById llamado con:", id)
        if (!id) throw new Error("vendor_id es requerido")
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("vendor_id", id)
            .single();

        if (error?.code === "PGRST116") return null;
        if (error) throw error;
        return data;
    }

    async findByEmail(vendor_email) {
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("vendor_email", vendor_email)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    // async findByTaxId(vendor_ruc) {
    //     const { data, error } = await supabase
    //         .from("vendors")
    //         .select("*")
    //         .eq("vendor_ruc", vendor_ruc)
    //         .maybeSingle();

    //     if (error) throw error;
    //     return data;
    // }

    async update(vendor_id, data) {
        const payload = {
            vendor_name: data.vendor_name,
            vendor_email: data.vendor_email,
            vendor_ruc: data.vendor_ruc,
            vendor_phone: data.vendor_phone,
            vendor_address: data.vendor_address,
            updated_at: new Date(),
        };

        const { data: vendor, error } = await supabase
            .from("vendors")
            .update(payload)
            .eq("vendor_id", vendor_id)
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }

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

    async findCategoriesByVendorId(vendor_id) {
        const { data, error } = await supabase
            .from("vendor_categories")
            .select("category_id, categories(category_name)")
            .eq("vendor_id", vendor_id);

        if (error) throw error;
        return data;
    }
}

module.exports = new VendorRepository();
