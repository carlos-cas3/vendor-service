const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const SUPABASE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !SUPABASE_ROLE_KEY) {
  throw new Error('SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en las variables de entorno');
}

const supabase = createClient(supabaseUrl, SUPABASE_ROLE_KEY);

module.exports = supabase;
