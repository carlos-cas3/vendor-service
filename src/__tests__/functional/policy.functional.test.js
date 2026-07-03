jest.mock("../../repositories/vendor-policy.repository", () => ({
  findByVendorId: jest.fn(),
  upsert: jest.fn(),
}));

const request = require("supertest");
const app = require("../../app");
const vendorPolicyRepository = require("../../repositories/vendor-policy.repository");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/vendors/:vendor_id/policy", () => {
  it("retorna 200 con política si existe", async () => {
    // Arrange
    vendorPolicyRepository.findByVendorId.mockResolvedValue({
      policy_id: 1,
      vendor_id: 1,
      return_policy_description: "Devolución en 30 días",
    });
    // Act
    const res = await request(app)
      .get("/api/vendors/1/policy")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data.return_policy_description).toBe(
      "Devolución en 30 días",
    );
  });

  it("retorna 200 con data null si no hay política", async () => {
    // Arrange
    vendorPolicyRepository.findByVendorId.mockResolvedValue(null);
    // Act
    const res = await request(app)
      .get("/api/vendors/1/policy")
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();
  });
});

describe("PUT /api/vendors/:vendor_id/policy", () => {
  it("crea/actualiza política y retorna 200", async () => {
    // Arrange
    vendorPolicyRepository.upsert.mockResolvedValue({
      policy_id: 1,
      vendor_id: 1,
      return_policy_description: "Nueva política",
    });
    // Act
    const res = await request(app)
      .put("/api/vendors/1/policy")
      .send({ description: "Nueva política" })
      .expect(200);
    // Assert
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Política guardada exitosamente");
  });
});
