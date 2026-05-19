const supabase = require("../database/connection");

class BranchRepository {
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

    async update(branchId, data) {
        const { data: branch, error } = await supabase
            .from("branches")
            .update({
                city_id: data.city_id,

                branch_name: data.branch_name,

                branch_address: data.branch_address,

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

    async deactivate(branchId) {
        return this.updateStatus(branchId, "INACTIVE");
    }
}

module.exports = new BranchRepository();
