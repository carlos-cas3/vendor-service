const supabase = require("../database/connection");

class CategoryRepository {
    async findAll() {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("category_name", { ascending: true });

        if (error) throw error;

        return data;
    }

    async findById(categoryId) {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("category_id", categoryId)
            .single();

        if (error && error.code === "PGRST116") {
            return null;
        }

        if (error) throw error;

        return data;
    }
    async findByVendorId(vendorId) {
        const { data, error } = await supabase
            .from("vendor_categories")
            .select(
                `
            categories (
                category_id,
                category_name
            )
        `,
            )
            .eq("vendor_id", vendorId);

        if (error) throw error;

        return data;
    }

    async assignToVendor(vendorId, categoryId) {
        const { data, error } = await supabase
            .from("vendor_categories")
            .upsert(
                {
                    vendor_id: vendorId,
                    category_id: categoryId,
                },
                {
                    onConflict: "vendor_id,category_id",
                },
            )
            .select()
            .single();

        if (error) throw error;

        return data;
    }

    async removeFromVendor(vendorId, categoryId) {
        const { error } = await supabase
            .from("vendor_categories")
            .delete()
            .eq("vendor_id", vendorId)
            .eq("category_id", categoryId);

        if (error) throw error;

        return true;
    }

    async replaceVendorCategories(vendorId, categoryIds) {
        await supabase
            .from("vendor_categories")
            .delete()
            .eq("vendor_id", vendorId);

        if (categoryIds.length === 0) {
            return [];
        }

        const rows = categoryIds.map((categoryId) => ({
            vendor_id: vendorId,
            category_id: categoryId,
        }));

        const { data, error } = await supabase
            .from("vendor_categories")
            .insert(rows)
            .select();

        if (error) throw error;

        return data;
    }
}

module.exports = new CategoryRepository();
