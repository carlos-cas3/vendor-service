-- ============================================================
-- Vendor Service - Esquema de Base de Datos (Supabase/PostgreSQL)
-- ============================================================

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== CATÁLOGOS ====================

-- roles
CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  role_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cities
CREATE TABLE IF NOT EXISTS cities (
  city_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL DEFAULT 'México',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- payment_methods
CREATE TABLE IF NOT EXISTS payment_methods (
  payment_method_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== TABLAS PRINCIPALES ====================

-- vendors
CREATE TABLE IF NOT EXISTS vendors (
  vendor_id SERIAL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  tax_id VARCHAR(50) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  website VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- branches
CREATE TABLE IF NOT EXISTS branches (
  branch_id SERIAL PRIMARY KEY,
  vendor_id INTEGER NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city_id INTEGER REFERENCES cities(city_id),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  phone VARCHAR(50),
  email VARCHAR(255),
  schedule TEXT,
  is_main BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- vendor_payment_methods (relación N:N)
CREATE TABLE IF NOT EXISTS vendor_payment_methods (
  vendor_id INTEGER NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  payment_method_id INTEGER NOT NULL REFERENCES payment_methods(payment_method_id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (vendor_id, payment_method_id)
);

-- vendor_categories (relación N:N)
CREATE TABLE IF NOT EXISTS vendor_categories (
  vendor_id INTEGER NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (vendor_id, category_id)
);

-- vendor_policies
CREATE TABLE IF NOT EXISTS vendor_policies (
  policy_id SERIAL PRIMARY KEY,
  vendor_id INTEGER NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  policy_type VARCHAR(50) NOT NULL,
  policy_value TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- commission_config
CREATE TABLE IF NOT EXISTS commission_config (
  config_id SERIAL PRIMARY KEY,
  vendor_id INTEGER NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  commission_type VARCHAR(50) NOT NULL,
  commission_value DECIMAL(10, 2) NOT NULL,
  min_amount DECIMAL(12, 2),
  max_amount DECIMAL(12, 2),
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users (referencia lógica con auth-service)
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(vendor_id) ON DELETE SET NULL,
  auth_user_id VARCHAR(255) UNIQUE,
  role_id INTEGER NOT NULL REFERENCES roles(role_id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== ÍNDICES ====================

CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_tax_id ON vendors(tax_id);

CREATE INDEX IF NOT EXISTS idx_branches_vendor_id ON branches(vendor_id);
CREATE INDEX IF NOT EXISTS idx_branches_city_id ON branches(city_id);
CREATE INDEX IF NOT EXISTS idx_branches_status ON branches(status);

CREATE INDEX IF NOT EXISTS idx_vendor_policies_vendor_id ON vendor_policies(vendor_id);
CREATE INDEX IF NOT EXISTS idx_commission_config_vendor_id ON commission_config(vendor_id);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_vendor_id ON users(vendor_id);

-- ==================== SEEDS ====================

INSERT INTO roles (role_name, role_description) VALUES
  ('SUPER_ADMIN', 'Super Administrator'),
  ('VENDOR_ADMIN', 'Vendor Administrator'),
  ('VENDOR_USER', 'Vendor User')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO payment_methods (name, code, description) VALUES
  ('Efectivo', 'CASH', 'Pago en efectivo'),
  ('Tarjeta de Débito', 'DEBIT', 'Pago con tarjeta de débito'),
  ('Tarjeta de Crédito', 'CREDIT', 'Pago con tarjeta de crédito'),
  ('Transferencia', 'TRANSFER', 'Transferencia bancaria'),
  ('PayPal', 'PAYPAL', 'Pago vía PayPal')
ON CONFLICT (code) DO NOTHING;
