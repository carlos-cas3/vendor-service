const supabase = require('../database/connection');

class BranchRepository {
  async create(data) {
    const { data: branch, error } = await supabase
      .from('branches')
      .insert([{
        vendor_id: data.vendor_id,
        name: data.name,
        address: data.address,
        city_id: data.city_id,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        email: data.email,
        schedule: data.schedule,
        is_main: data.is_main || false,
      }])
      .select()
      .single();

    if (error) throw error;
    return branch;
  }

  async findByVendorId(vendorId, filters = {}) {
    let query = supabase
      .from('branches')
      .select('*')
      .eq('vendor_id', vendorId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('is_main', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('branch_id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async update(id, data) {
    const { data: branch, error } = await supabase
      .from('branches')
      .update({
        ...data,
        updated_at: new Date(),
      })
      .eq('branch_id', id)
      .select()
      .single();

    if (error) throw error;
    return branch;
  }

  async updateStatus(id, status) {
    const { data: branch, error } = await supabase
      .from('branches')
      .update({ status, updated_at: new Date() })
      .eq('branch_id', id)
      .select()
      .single();

    if (error) throw error;
    return branch;
  }

  async delete(id) {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('branch_id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = new BranchRepository();
