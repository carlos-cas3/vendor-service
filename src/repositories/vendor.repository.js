const supabase = require("../database/connection");

class VendorRepository {
    async create(data) {
        const { data: vendor, error } = await supabase
            .from("vendors")
            .insert([
                {
                    vendor_name: data.name,
                    vendor_ruc: data.ruc,
                    vendor_email: data.email,
                    vendor_phone: data.phone,
                    vendor_address: data.address,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }

    async addCategories(vendorId, categories) {
        const records = categories.map((categoryId) => ({
            vendor_id: vendorId,
            category_id: categoryId,
        }));

        const { error } = await supabase
            .from("vendor_categories")
            .insert(records);

        if (error) throw error;
    }

    async createVendor(data) {
        // 1. crear vendor
        const vendor = await vendorRepository.create(data);

        // 2. insertar categorías
        if (data.categories && data.categories.length > 0) {
            await vendorRepository.addCategories(
                vendor.vendor_id,
                data.categories,
            );
        }

        return vendor;
    }

    async findAll(filters = {}) {
        let query = supabase.from("vendors").select("*");

        if (filters.status) {
            query = query.eq("status", filters.status);
        }
        if (filters.email) {
            query = query.eq("email", filters.email);
        }
        if (filters.tax_id) {
            query = query.eq("tax_id", filters.tax_id);
        }

        query = query.order("created_at", { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async findById(id) {
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("vendor_id", id)
            .single();

        if (error && error.code === "PGRST116") return null;
        if (error) throw error;
        return data;
    }

    async findByEmail(email) {
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async findByTaxId(tax_id) {
        const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .eq("tax_id", tax_id)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async update(id, data) {
        const { data: vendor, error } = await supabase
            .from("vendors")
            .update({
                ...data,
                updated_at: new Date(),
            })
            .eq("vendor_id", id)
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }

    async updateStatus(id, status) {
        const { data: vendor, error } = await supabase
            .from("vendors")
            .update({ status, updated_at: new Date() })
            .eq("vendor_id", id)
            .select()
            .single();

        if (error) throw error;
        return vendor;
    }
}

module.exports = new VendorRepository();
