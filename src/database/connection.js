const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

/**
 * URL de Supabase desde variable de entorno.
 * @type {string}
 */
const supabaseUrl = process.env.SUPABASE_URL;

/**
 * Service role key de Supabase (admin, bypass RLS).
 * @type {string}
 */
const SUPABASE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !SUPABASE_ROLE_KEY) {
  throw new Error('SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en las variables de entorno');
}

/**
 * Cliente de Supabase con service_role_key para acceso administrativo.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 *
 * @example
 * const supabase = require('./database/connection');
 * const { data } = await supabase.from("vendors").select("*");
 */
const supabase = createClient(supabaseUrl, SUPABASE_ROLE_KEY, {
  realtime: { transport: ws },
});

module.exports = supabase;
