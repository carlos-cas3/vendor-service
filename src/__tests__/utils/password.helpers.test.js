const crypto = require("crypto");
const { generateTempPassword } = require("../../utils/password.helpers");

describe("generateTempPassword", () => {
  let callCount;

  beforeEach(() => {
    callCount = 0;
    jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
      callCount++;
      return Buffer.from(callCount === 1 ? "TestVendor" : "abcdefghij", "ascii");
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("genera una cadena de 10 caracteres", () => {
    const password = generateTempPassword();
    expect(password).toHaveLength(10);
  });

  it("genera solo caracteres alfanuméricos", () => {
    const password = generateTempPassword();
    expect(password).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it("genera valores diferentes en cada llamada", () => {
    const p1 = generateTempPassword();
    const p2 = generateTempPassword();
    expect(p1).not.toBe(p2);
  });
});
