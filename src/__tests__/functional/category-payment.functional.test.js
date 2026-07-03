jest.mock("../../repositories/vendor.repository", () => ({
  findById: jest.fn(),
}));

jest.mock("../../repositories/category.repository", () => ({
  findAll: jest.fn(),
  findByVendorId: jest.fn(),
  findById: jest.fn(),
  replaceVendorCategories: jest.fn(),
}));

jest.mock("../../repositories/payment-method.repository", () => ({
  findAll: jest.fn(),
  findByVendorId: jest.fn(),
  replaceVendorPaymentMethods: jest.fn(),
}));

const request = require("supertest");
const app = require("../../app");
const vendorRepository = require("../../repositories/vendor.repository");
const categoryRepository = require("../../repositories/category.repository");
const paymentMethodRepository = require("../../repositories/payment-method.repository");
const { mockVendor } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/vendors/categories", () => {
  it("retorna 200 con lista de categorías", async () => {
    // Arrange
    categoryRepository.findAll.mockResolvedValue([
      { category_id: 1, name: "Restaurante" },
      { category_id: 2, name: "Tienda" },
    ]);
    // Act
    const res = await request(app).get("/api/vendors/categories").expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });
});

describe("GET /api/vendors/:vendor_id/categories", () => {
  it("retorna 200 con categorías del vendor", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    categoryRepository.findByVendorId.mockResolvedValue([
      { category_id: 1, categories: { category_id: 1, category_name: "Restaurante" } },
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/categories")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("retorna 404 si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .get("/api/vendors/999/categories")
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("PUT /api/vendors/:vendor_id/categories", () => {
  it("reemplaza categorías y retorna 200", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    categoryRepository.findById.mockResolvedValue({ category_id: 1, name: "Restaurante" });
    categoryRepository.replaceVendorCategories.mockResolvedValue([]);
    // Act
    const res = await request(app)
      .put("/api/vendors/1/categories")
      .send({ category_ids: [1] })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Categorías actualizadas correctamente");
  });

  it("retorna 400 si categoría no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    categoryRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .put("/api/vendors/1/categories")
      .send({ category_ids: [999] })
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/vendors/payment-methods", () => {
  it("retorna 200 con lista de métodos de pago", async () => {
    // Arrange
    paymentMethodRepository.findAll.mockResolvedValue([
      { payment_method_id: 1, name: "Efectivo", code: "CASH" },
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors/payment-methods")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

describe("GET /api/vendors/:vendor_id/payment-methods", () => {
  it("retorna 200 con métodos del vendor", async () => {
    // Arrange
    paymentMethodRepository.findByVendorId.mockResolvedValue([
      { payment_method_id: 1, name: "Efectivo", code: "CASH" },
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/payment-methods")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

describe("PUT /api/vendors/:vendor_id/payment-methods", () => {
  it("reemplaza métodos de pago y retorna 200", async () => {
    // Arrange
    paymentMethodRepository.replaceVendorPaymentMethods.mockResolvedValue([]);
    // Act
    const res = await request(app)
      .put("/api/vendors/1/payment-methods")
      .send({ payment_method_ids: [1, 2] })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Métodos de pago actualizados correctamente");
  });
});
