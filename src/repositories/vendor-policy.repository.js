const supabase = require('../database/connection');

class VendorPolicyRepository {
  async create(data) {
    const { data: policy, error } = await supabase
      .from('vendor_policies')
      .insert([{
        vendor_id: data.vendor_id,
        policy_type: data.policy_type,
        policy_value: data.policy_value,
        description: data.description,
      }])
      .select()
      .single();

    if (error) throw error;
    return policy;
  }

  async findByVendorId(vendorId, filters = {}) {
    let query = supabase
      .from('vendor_policies')
      .select('*')
      .eq('vendor_id', vendorId);

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters.policy_type) {
      query = query.eq('policy_type', filters.policy_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('vendor_policies')
      .select('*')
      .eq('policy_id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async update(id, data) {
    const { data: policy, error } = await supabase
      .from('vendor_policies')
      .update({
        ...data,
        updated_at: new Date(),
      })
      .eq('policy_id', id)
      .select()
      .single();

    if (error) throw error;
    return policy;
  }

  async delete(id) {
    const { error } = await supabase
      .from('vendor_policies')
      .delete()
      .eq('policy_id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = new VendorPolicyRepository();
