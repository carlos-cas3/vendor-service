const { generateTempPassword } = require("../../utils/password.helpers");

describe("generateTempPassword", () => {
  it("genera una cadena de 10 caracteres", () => {
    // Arrange
    // Act
    const password = generateTempPassword();
    // Assert
    expect(password).toHaveLength(10);
  });

  it("genera solo caracteres alfanuméricos", () => {
    // Arrange
    // Act
    const password = generateTempPassword();
    // Assert
    expect(password).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it("genera valores diferentes en cada llamada", () => {
    // Arrange
    // Act
    const p1 = generateTempPassword();
    const p2 = generateTempPassword();
    // Assert
    expect(p1).not.toBe(p2);
  });
});
