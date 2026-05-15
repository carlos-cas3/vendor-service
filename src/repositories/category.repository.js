const supabase = require('../database/connection');

class CategoryRepository {
  async findAll(filters = {}) {
    let query = supabase.from('categories').select('*');

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async findByVendorId(vendorId) {
    const { data, error } = await supabase
      .from('vendor_categories')
      .select('categories(*)')
      .eq('vendor_id', vendorId);

    if (error) throw error;
    return data.map(item => item.categories);
  }

  async assignToVendor(vendorId, categoryId) {
    const { data, error } = await supabase
      .from('vendor_categories')
      .upsert({
        vendor_id: vendorId,
        category_id: categoryId,
      }, { onConflict: 'vendor_id,category_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeFromVendor(vendorId, categoryId) {
    const { error } = await supabase
      .from('vendor_categories')
      .delete()
      .eq('vendor_id', vendorId)
      .eq('category_id', categoryId);

    if (error) throw error;
    return true;
  }
}

module.exports = new CategoryRepository();
