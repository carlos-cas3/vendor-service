jest.mock("../../repositories/vendor.repository", () => ({
  findById: jest.fn(),
}));

jest.mock("../../repositories/commission.repository", () => ({
  findByVendorId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const request = require("supertest");
const app = require("../../app");
const vendorRepository = require("../../repositories/vendor.repository");
const commissionRepository = require("../../repositories/commission.repository");
const { mockVendor, mockCommission } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/vendors/:vendor_id/commission", () => {
  it("retorna 200 con configuración si existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    commissionRepository.findByVendorId.mockResolvedValue([
      mockCommission({ config_id: 1, commission_rate: 0.15 }),
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/commission")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.config_id).toBe(1);
    expect(res.body.data.commission_rate).toBe(0.15);
  });

  it("retorna 200 con data null si no hay configuración", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    commissionRepository.findByVendorId.mockResolvedValue([]);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/commission")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();
  });

  it("retorna 404 si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .get("/api/vendors/999/commission")
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/vendors/:vendor_id/commission", () => {
  it("crea configuración y retorna 201", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    commissionRepository.findByVendorId.mockResolvedValue([]);
    commissionRepository.create.mockResolvedValue(
      mockCommission({ config_id: 1, commission_rate: 0.15 }),
    );
    // Act
    const res = await request(app)
      .post("/api/vendors/1/commission")
      .send({ commission_rate: 0.15 })
      .expect(201);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.commission_rate).toBe(0.15);
  });

  it("retorna 400 si commission_rate es inválido", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    // Act
    const res = await request(app)
      .post("/api/vendors/1/commission")
      .send({ commission_rate: 1.5 })
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("PUT /api/vendors/commission/:config_id", () => {
  it("actualiza configuración y retorna 200", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(
      mockCommission({ config_id: 1, commission_rate: 0.10 }),
    );
    commissionRepository.update.mockResolvedValue(
      mockCommission({ config_id: 1, commission_rate: 0.25 }),
    );
    // Act
    const res = await request(app)
      .put("/api/vendors/commission/1")
      .send({ commission_rate: 0.25 })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.commission_rate).toBe(0.25);
  });

  it("retorna 404 si configuración no existe", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .put("/api/vendors/commission/999")
      .send({ commission_rate: 0.25 })
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /api/vendors/commission/:config_id", () => {
  it("elimina configuración y retorna 200", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(
      mockCommission({ config_id: 1 }),
    );
    commissionRepository.delete.mockResolvedValue(true);
    // Act
    const res = await request(app)
      .delete("/api/vendors/commission/1")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Configuración eliminada");
  });

  it("retorna 404 si configuración no existe", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .delete("/api/vendors/commission/999")
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});
