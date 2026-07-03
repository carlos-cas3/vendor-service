jest.mock("../../repositories/vendor.repository", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByTaxId: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  addCategories: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("../../clients/auth.client");
jest.mock("../../clients/analytics.client");

const request = require("supertest");
const app = require("../../app");
const vendorRepository = require("../../repositories/vendor.repository");
const authClient = require("../../clients/auth.client");
const { sendEvent } = require("../../clients/analytics.client");
const { mockVendor } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /health", () => {
  it("retorna 200 con status ok", async () => {
    // Arrange
    // Act
    const res = await request(app).get("/health").expect(200);
    // Assert
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("vendor-service");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("POST /api/vendors", () => {
  it("crea vendor y retorna 201", async () => {
    // Arrange
    const data = {
      vendor_name: "Test Vendor",
      vendor_email: "test@example.com",
      vendor_ruc: "ABC123",
    };
    vendorRepository.create.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    authClient.createUser.mockResolvedValue({ user_id: 42 });
    vendorRepository.update.mockResolvedValue(
      mockVendor({ vendor_id: 1, user_id: 42 }),
    );
    // Act
    const res = await request(app).post("/api/vendors").send(data).expect(201);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.vendor_id).toBe(1);
    expect(res.body.message).toBe("Proveedor creado exitosamente");
  });

  it("retorna 400 si falta vendor_name", async () => {
    // Arrange
    const data = { vendor_email: "test@example.com", vendor_ruc: "ABC123" };
    // Act
    const res = await request(app)
      .post("/api/vendors")
      .send(data)
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
  });

  it("retorna 400 si email es inválido", async () => {
    // Arrange
    const data = {
      vendor_name: "Test",
      vendor_email: "invalido",
      vendor_ruc: "ABC123",
    };
    // Act
    const res = await request(app)
      .post("/api/vendors")
      .send(data)
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Email válido es requerido/);
  });
});

describe("GET /api/vendors", () => {
  it("retorna 200 con lista de vendors", async () => {
    // Arrange
    vendorRepository.findAll.mockResolvedValue([mockVendor({ vendor_id: 1 })]);
    // Act
    const res = await request(app).get("/api/vendors").expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("filtra por vendor_status", async () => {
    // Arrange
    vendorRepository.findAll.mockResolvedValue([
      mockVendor({ vendor_id: 1, vendor_status: "ACTIVE" }),
    ]);
    // Act
    const res = await request(app)
      .get("/api/vendors?vendor_status=ACTIVE")
      .expect(200);
    // Assert
    expect(vendorRepository.findAll).toHaveBeenCalledWith({
      vendor_status: "ACTIVE",
      vendor_email: undefined,
      vendor_ruc: undefined,
    });
    expect(res.body.success).toBe(true);
  });
});

describe("GET /api/vendors/:id", () => {
  it("retorna 200 con vendor si existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    // Act
    const res = await request(app).get("/api/vendors/1").expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.vendor_id).toBe(1);
  });

  it("retorna 404 si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app).get("/api/vendors/999").expect(404);
    // Assert
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Proveedor no encontrado");
  });
});

describe("PATCH /api/vendors/:id", () => {
  it("retorna 200 si actualiza correctamente", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    vendorRepository.update.mockResolvedValue(
      mockVendor({ vendor_id: 1, vendor_name: "Actualizado" }),
    );
    // Act
    const res = await request(app)
      .patch("/api/vendors/1")
      .send({ vendor_name: "Actualizado" })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.vendor_name).toBe("Actualizado");
  });

  it("retorna 404 si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .patch("/api/vendors/999")
      .send({ vendor_name: "Nuevo" })
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });

  it("retorna 409 si email ya está registrado", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(
      mockVendor({ vendor_id: 1, vendor_email: "actual@test.com" }),
    );
    vendorRepository.findByEmail.mockResolvedValue(
      mockVendor({ vendor_id: 2, vendor_email: "otro@test.com" }),
    );
    // Act
    const res = await request(app)
      .patch("/api/vendors/1")
      .send({ vendor_email: "otro@test.com" })
      .expect(409);
    // Assert
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/email ya está registrado/);
  });
});

describe("PATCH /api/vendors/:id/status", () => {
  it("retorna 200 si estado es válido", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(
      mockVendor({ vendor_id: 1, vendor_status: "PENDING" }),
    );
    vendorRepository.updateStatus.mockResolvedValue(
      mockVendor({ vendor_id: 1, vendor_status: "ACTIVE" }),
    );
    // Act
    const res = await request(app)
      .patch("/api/vendors/1/status")
      .send({ status: "ACTIVE" })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.vendor_status).toBe("ACTIVE");
  });

  it("retorna 400 si estado es inválido", async () => {
    // Arrange
    // Act
    const res = await request(app)
      .patch("/api/vendors/1/status")
      .send({ status: "INVALID" })
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Estado inválido/);
  });

  it("retorna 404 si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .patch("/api/vendors/999/status")
      .send({ status: "ACTIVE" })
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/vendors/:id/status", () => {
  it("retorna 200 con { vendor_id, status }", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(
      mockVendor({ vendor_id: 1, vendor_status: "ACTIVE" }),
    );
    // Act
    const res = await request(app).get("/api/vendors/1/status").expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      vendor_id: 1,
      status: "ACTIVE",
    });
  });

  it("retorna 404 si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app).get("/api/vendors/999/status").expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("404 en rutas inexistentes", () => {
  it("retorna 404 para rutas no existentes", async () => {
    // Arrange
    // Act
    const res = await request(app)
      .get("/api/vendors/1/inexistente")
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});
