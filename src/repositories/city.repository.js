const supabase = require("../database/connection");

class CityRepository {
    async findAll() {
        const { data, error } = await supabase
            .from("cities")
            .select("*")
            .order("city_name", { ascending: true });

        if (error) throw error;

        return data;
    }

    async findById(cityId) {
        const { data, error } = await supabase
            .from("cities")
            .select("*")
            .eq("city_id", cityId)
            .single();

        if (error && error.code === "PGRST116") {
            return null;
        }

        if (error) throw error;

        return data;
    }
}

module.exports = new CityRepository();
