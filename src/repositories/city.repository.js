const supabase = require("../database/connection");

class CityRepository {
    /**
     * Lista todas las ciudades disponibles.
     *
     * @returns {Promise<Array>} Lista de ciudades
     */
    async findAll() {
        const { data, error } = await supabase
            .from("cities")
            .select("*")
            .order("city_name", { ascending: true });

        if (error) throw error;

        return data;
    }

    /**
     * Busca una ciudad por su ID.
     *
     * @param {number} cityId - ID de la ciudad
     * @returns {Promise<Object|null>} Ciudad o null
     */
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
