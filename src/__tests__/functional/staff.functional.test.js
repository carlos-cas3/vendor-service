jest.mock("../../repositories/staff.repository", () => ({
  create: jest.fn(),
  findByVendorId: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
}));

jest.mock("../../clients/auth.client");
jest.mock("../../clients/analytics.client");

const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../../app");
const staffRepository = require("../../repositories/staff.repository");
const authClient = require("../../clients/auth.client");
const { mockStaff } = require("../helpers/mocks");

const JWT_SECRET = "test-jwt-secret";

function createAuthToken(overrides = {}) {
  return jwt.sign(
    { roleId: 2, vendorId: 1, userId: 1, ...overrides },
    JWT_SECRET,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = JWT_SECRET;
});

describe("GET /api/vendors/staff", () => {
  it("retorna 200 con lista de staff", async () => {
    // Arrange
    const token = createAuthToken();
    staffRepository.findByVendorId.mockResolvedValue([mockStaff()]);
    // Act
    const res = await request(app)
      .get("/api/vendors/staff")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // Assert
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  it("retorna 401 sin token", async () => {
    // Arrange
    // Act
    const res = await request(app).get("/api/vendors/staff").expect(401);
    // Assert
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Token requerido");
  });

  it("retorna 403 si el rol no tiene permisos", async () => {
    // Arrange
    const token = createAuthToken({ roleId: 3 });
    // Act
    const res = await request(app)
      .get("/api/vendors/staff")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
    // Assert
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No tienes permisos para esta acción");
  });
});

describe("POST /api/vendors/staff", () => {
  it("crea staff y retorna 201", async () => {
    // Arrange
    const token = createAuthToken();
    authClient.createInternalUser.mockResolvedValue({ user_id: 10 });
    staffRepository.create.mockResolvedValue(mockStaff({ staff_id: 1 }));
    // Act
    const res = await request(app)
      .post("/api/vendors/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "Juan",
        last_name: "Pérez",
        email: "juan@vendor.com",
        role_id: 3,
      })
      .expect(201);
    // Assert
    expect(res.body.staff_id).toBe(1);
  });

  it("retorna 400 si faltan campos requeridos", async () => {
    // Arrange
    const token = createAuthToken();
    // Act
    const res = await request(app)
      .post("/api/vendors/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ first_name: "Juan" })
      .expect(400);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/vendors/staff/:staff_id", () => {
  it("retorna 200 si staff existe y pertenece al vendor", async () => {
    // Arrange
    const token = createAuthToken();
    staffRepository.findById.mockResolvedValue(
      mockStaff({ staff_id: 1, vendor_id: 1 }),
    );
    // Act
    const res = await request(app)
      .get("/api/vendors/staff/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // Assert
    expect(res.body.staff_id).toBe(1);
    expect(res.body.vendor_id).toBe(1);
  });

  it("retorna 404 si staff no existe", async () => {
    // Arrange
    const token = createAuthToken();
    staffRepository.findById.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .get("/api/vendors/staff/999")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    // Assert
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /api/vendors/staff/:staff_id", () => {
  it("desactiva staff y retorna 200", async () => {
    // Arrange
    const token = createAuthToken();
    staffRepository.findById.mockResolvedValue(
      mockStaff({ staff_id: 1, vendor_id: 1, user_id: 10 }),
    );
    authClient.updateUserStatus.mockResolvedValue();
    staffRepository.updateStatus.mockResolvedValue(
      mockStaff({ staff_id: 1, status: "INACTIVE" }),
    );
    // Act
    const res = await request(app)
      .delete("/api/vendors/staff/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // Assert
    expect(res.body.status).toBe("INACTIVE");
  });
});

describe("GET /api/internal/staff", () => {
  it("retorna 200 con x-service-secret correcto", async () => {
    // Arrange
    staffRepository.findByVendorId.mockResolvedValue([mockStaff()]);
    // Act
    const res = await request(app)
      .get("/api/internal/staff?vendor_id=1")
      .set("x-service-secret", "test-internal-secret")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("retorna 401 sin x-service-secret", async () => {
    // Arrange
    // Act
    const res = await request(app)
      .get("/api/internal/staff?vendor_id=1")
      .expect(401);
    // Assert
    expect(res.body.success).toBe(false);
  });
});
