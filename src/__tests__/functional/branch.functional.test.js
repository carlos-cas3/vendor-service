jest.mock("../../repositories/vendor.repository", () => ({
  findById: jest.fn(),
}));

jest.mock("../../repositories/branch.repository", () => ({
  create: jest.fn(),
  findActiveByVendorId: jest.fn(),
  findByVendorId: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
}));

jest.mock("../../repositories/city.repository", () => ({
  findById: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../../clients/analytics.client");

const request = require("supertest");
const app = require("../../app");
const vendorRepository = require("../../repositories/vendor.repository");
const branchRepository = require("../../repositories/branch.repository");
const cityRepository = require("../../repositories/city.repository");
const { mockVendor, mockBranch } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/vendors/:vendor_id/branches", () => {
  it("crea sucursal y retorna 201", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    cityRepository.findById.mockResolvedValue({ city_id: 1, city_name: "Test" });
    branchRepository.create.mockResolvedValue(
      mockBranch({
        branch_id: 1,
        vendor_id: 1,
        city_id: 1,
        branch_address: "Calle 123",
      }),
    );
    // Act
    const res = await request(app)
      .post("/api/vendors/1/branches")
      .send({ city_id: 1, branch_address: "Calle 123" })
      .expect(201);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.branch_id).toBe(1);
    expect(res.body.message).toBe("Sucursal creada exitosamente");
  });

  it("retorna 400 si falta city_id", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    // Act
    const res = await request(app)
      .post("/api/vendors/1/branches")
      .send({ branch_address: "Calle 123" })
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/vendors/:vendor_id/branches", () => {
  it("retorna 200 con lista de sucursales", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    branchRepository.findByVendorId.mockResolvedValue([
      mockBranch({ branch_id: 1 }),
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/branches")
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
      .get("/api/vendors/999/branches")
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/vendors/:vendor_id/branches/active", () => {
  it("retorna 200 con sucursales activas", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    branchRepository.findActiveByVendorId.mockResolvedValue([
      mockBranch({ branch_id: 1, branch_status: "ACTIVE" }),
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/branches/active")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

describe("GET /api/vendors/branches/:branch_id", () => {
  it("retorna 200 si sucursal existe", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(mockBranch({ branch_id: 1 }));
    // Act
    const res = await request(app)
      .get("/api/vendors/branches/1")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.branch_id).toBe(1);
  });

  it("retorna 404 si no existe", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .get("/api/vendors/branches/999")
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("PATCH /api/vendors/branches/:branch_id/status", () => {
  it("retorna 200 si estado es válido", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(
      mockBranch({ branch_id: 1, branch_status: "ACTIVE" }),
    );
    branchRepository.updateStatus.mockResolvedValue(
      mockBranch({ branch_id: 1, branch_status: "MAINTENANCE" }),
    );
    // Act
    const res = await request(app)
      .patch("/api/vendors/branches/1/status")
      .send({ branch_status: "MAINTENANCE" })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.branch_status).toBe("MAINTENANCE");
  });

  it("retorna 400 si estado es inválido", async () => {
    // Arrange
    // Act
    const res = await request(app)
      .patch("/api/vendors/branches/1/status")
      .send({ branch_status: "INVALID" })
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /api/vendors/branches/:branch_id", () => {
  it("desactiva sucursal y retorna 200", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(
      mockBranch({ branch_id: 1, vendor_id: 1 }),
    );
    branchRepository.updateStatus.mockResolvedValue(
      mockBranch({ branch_id: 1, branch_status: "INACTIVE" }),
    );
    // Act
    const res = await request(app)
      .delete("/api/vendors/branches/1")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Sucursal desactivada exitosamente");
  });
});

describe("GET /api/vendors/cities", () => {
  it("retorna 200 con lista de ciudades", async () => {
    // Arrange
    cityRepository.findAll.mockResolvedValue([
      { city_id: 1, name: "Ciudad de México" },
    ]);
    // Act
    const res = await request(app).get("/api/vendors/cities").expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});
