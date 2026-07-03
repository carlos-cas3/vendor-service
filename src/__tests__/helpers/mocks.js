const mockVendor = (overrides = {}) => ({
  vendor_id: 1,
  vendor_name: "Test Vendor",
  vendor_email: "test@example.com",
  vendor_ruc: "ABC123456",
  vendor_phone: "555-0100",
  vendor_address: "Calle 123",
  vendor_status: "PENDING",
  user_id: null,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const mockBranch = (overrides = {}) => ({
  branch_id: 1,
  vendor_id: 1,
  branch_name: "Sucursal Centro",
  branch_address: "Av. Central 456",
  city_id: 1,
  branch_status: "ACTIVE",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const mockCommission = (overrides = {}) => ({
  config_id: 1,
  vendor_id: 1,
  commission_rate: 0.15,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const mockStaff = (overrides = {}) => ({
  staff_id: 1,
  user_id: 10,
  vendor_id: 1,
  role_id: 3,
  first_name: "Juan",
  last_name: "Pérez",
  email: "juan@vendor.com",
  personal_phone: "555-0200",
  status: "ACTIVE",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

module.exports = { mockVendor, mockBranch, mockCommission, mockStaff };
