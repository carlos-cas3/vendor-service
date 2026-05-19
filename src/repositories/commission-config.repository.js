// FALTA IMPLEMENTAR CORRECTAMENTE SUS RUTAS


const supabase = require('../database/connection');

class CommissionConfigRepository {
  async create(data) {
    const { data: config, error } = await supabase
      .from('commission_config')
      .insert([{
        vendor_id: data.vendor_id,
        commission_type: data.commission_type,
        commission_value: data.commission_value,
        min_amount: data.min_amount,
        max_amount: data.max_amount,
        effective_date: data.effective_date,
        expiration_date: data.expiration_date,
      }])
      .select()
      .single();

    if (error) throw error;
    return config;
  }

  async findByVendorId(vendorId, filters = {}) {
    let query = supabase
      .from('commission_config')
      .select('*')
      .eq('vendor_id', vendorId);

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters.commission_type) {
      query = query.eq('commission_type', filters.commission_type);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('commission_config')
      .select('*')
      .eq('config_id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async update(id, data) {
    const { data: config, error } = await supabase
      .from('commission_config')
      .update({
        ...data,
        updated_at: new Date(),
      })
      .eq('config_id', id)
      .select()
      .single();

    if (error) throw error;
    return config;
  }

  async delete(id) {
    const { error } = await supabase
      .from('commission_config')
      .delete()
      .eq('config_id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = new CommissionConfigRepository();
