const supabase = require('../database/connection');

class PaymentMethodRepository {
  async findAll(filters = {}) {
    let query = supabase.from('payment_methods').select('*');

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
      .from('payment_methods')
      .select('*')
      .eq('payment_method_id', id)
      .single();

    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async findByCode(code) {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByVendorId(vendorId) {
    const { data, error } = await supabase
      .from('vendor_payment_methods')
      .select('payment_methods(*)')
      .eq('vendor_id', vendorId)
      .eq('is_active', true);

    if (error) throw error;
    return data.map(item => item.payment_methods);
  }

  async assignToVendor(vendorId, paymentMethodId) {
    const { data, error } = await supabase
      .from('vendor_payment_methods')
      .upsert({
        vendor_id: vendorId,
        payment_method_id: paymentMethodId,
      }, { onConflict: 'vendor_id,payment_method_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeFromVendor(vendorId, paymentMethodId) {
    const { error } = await supabase
      .from('vendor_payment_methods')
      .delete()
      .eq('vendor_id', vendorId)
      .eq('payment_method_id', paymentMethodId);

    if (error) throw error;
    return true;
  }
}

module.exports = new PaymentMethodRepository();
