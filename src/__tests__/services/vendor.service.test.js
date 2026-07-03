jest.mock("../../repositories/vendor.repository");
jest.mock("../../clients/auth.client");
jest.mock("../../clients/analytics.client");

const vendorRepository = require("../../repositories/vendor.repository");
const authClient = require("../../clients/auth.client");
const { sendEvent } = require("../../clients/analytics.client");
const vendorService = require("../../services/vendor.service");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("../../utils/errors");
const { mockVendor } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("VendorService._validateCreate", () => {
  it("lanza ValidationError si falta vendor_name", () => {
    // Arrange
    const data = { vendor_email: "a@b.com", vendor_ruc: "123" };
    // Act
    const act = () => vendorService.createVendor(data);
    // Assert
    expect(act).rejects.toThrow(ValidationError);
    expect(act).rejects.toThrow(/vendor_name es requerido/);
  });

  it("lanza ValidationError si falta vendor_email", () => {
    // Arrange
    const data = { vendor_name: "Test", vendor_ruc: "123" };
    // Act
    const act = () => vendorService.createVendor(data);
    // Assert
    expect(act).rejects.toThrow(ValidationError);
    expect(act).rejects.toThrow(/Email válido es requerido/);
  });

  it("lanza ValidationError si vendor_email tiene formato inválido", () => {
    // Arrange
    const data = {
      vendor_name: "Test",
      vendor_email: "invalido",
      vendor_ruc: "123",
    };
    // Act
    const act = () => vendorService.createVendor(data);
    // Assert
    expect(act).rejects.toThrow(ValidationError);
    expect(act).rejects.toThrow(/Email válido es requerido/);
  });

  it("lanza ValidationError si falta vendor_ruc", () => {
    // Arrange
    const data = { vendor_name: "Test", vendor_email: "a@b.com" };
    // Act
    const act = () => vendorService.createVendor(data);
    // Assert
    expect(act).rejects.toThrow(ValidationError);
    expect(act).rejects.toThrow(/RUC es requerido/);
  });

  it("lanza ValidationError con mensaje compuesto si faltan múltiples campos", () => {
    // Arrange
    const data = {};
    // Act
    const act = () => vendorService.createVendor(data);
    // Assert
    expect(act).rejects.toThrow(ValidationError);
    expect(act).rejects.toThrow(
      /vendor_name es requerido; Email válido es requerido; RUC es requerido/,
    );
  });
});

describe("VendorService.createVendor", () => {
  it("crea vendor, llama authClient.createUser y actualiza user_id", async () => {
    // Arrange
    const data = {
      vendor_name: "Test Vendor",
      vendor_email: "test@example.com",
      vendor_ruc: "ABC123456",
    };
    const createdVendor = mockVendor({ vendor_id: 1 });
    const authUser = { user_id: 42 };

    vendorRepository.create.mockResolvedValue(createdVendor);
    authClient.createUser.mockResolvedValue(authUser);
    vendorRepository.update.mockResolvedValue({
      ...createdVendor,
      user_id: 42,
    });
    // Act
    const result = await vendorService.createVendor(data);
    // Assert
    expect(vendorRepository.create).toHaveBeenCalledWith(data);
    expect(authClient.createUser).toHaveBeenCalledWith({
      ...data,
      vendor_id: 1,
    });
    expect(vendorRepository.update).toHaveBeenCalledWith(1, {
      user_id: 42,
    });
    expect(result.user_id).toBe(42);
  });

  it("revierte (delete) si authClient.createUser falla", async () => {
    // Arrange
    const data = {
      vendor_name: "Test",
      vendor_email: "a@b.com",
      vendor_ruc: "123",
    };
    vendorRepository.create.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    authClient.createUser.mockRejectedValue(new Error("Auth error"));
    // Act
    const act = vendorService.createVendor(data);
    // Assert
    await expect(act).rejects.toThrow(
      "Error creando usuario, se revirtió el vendor",
    );
    expect(vendorRepository.delete).toHaveBeenCalledWith(1);
  });

  it("asigna categorías si data.categories tiene elementos", async () => {
    // Arrange
    const data = {
      vendor_name: "Test",
      vendor_email: "a@b.com",
      vendor_ruc: "123",
      categories: [1, 2],
    };
    const createdVendor = mockVendor({ vendor_id: 1 });
    vendorRepository.create.mockResolvedValue(createdVendor);
    authClient.createUser.mockResolvedValue({ user_id: 42 });
    vendorRepository.update.mockResolvedValue({
      ...createdVendor,
      user_id: 42,
    });
    vendorRepository.addCategories.mockResolvedValue();
    // Act
    await vendorService.createVendor(data);
    // Assert
    expect(vendorRepository.addCategories).toHaveBeenCalledWith(1, [1, 2]);
  });

  it("envía evento VENDOR_CREATED a analytics", async () => {
    // Arrange
    const data = {
      vendor_name: "Test",
      vendor_email: "a@b.com",
      vendor_ruc: "123",
    };
    vendorRepository.create.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    authClient.createUser.mockResolvedValue({ user_id: 42 });
    vendorRepository.update.mockResolvedValue(
      mockVendor({ vendor_id: 1, user_id: 42 }),
    );
    // Act
    await vendorService.createVendor(data);
    // Assert
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "VENDOR_CREATED",
        aggregateId: 1,
      }),
    );
  });
});

describe("VendorService.findById", () => {
  it("retorna el vendor si existe", async () => {
    // Arrange
    const vendor = mockVendor({ vendor_id: 1 });
    vendorRepository.findById.mockResolvedValue(vendor);
    // Act
    const result = await vendorService.findById(1);
    // Assert
    expect(result).toEqual(vendor);
  });

  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = vendorService.findById(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
    await expect(act).rejects.toThrow("Proveedor no encontrado");
  });
});

describe("VendorService.update", () => {
  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = vendorService.update(999, { vendor_name: "Nuevo" });
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("lanza ConflictError si email ya está registrado por otro vendor", async () => {
    // Arrange
    const currentVendor = mockVendor({
      vendor_id: 1,
      vendor_email: "actual@example.com",
    });
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.findByEmail.mockResolvedValue(
      mockVendor({ vendor_id: 2, vendor_email: "otro@example.com" }),
    );
    // Act
    const act = vendorService.update(1, { vendor_email: "otro@example.com" });
    // Assert
    await expect(act).rejects.toThrow(ConflictError);
    await expect(act).rejects.toThrow(
      "El email ya está registrado por otro proveedor",
    );
  });

  it("lanza ConflictError si RUC ya está registrado por otro vendor", async () => {
    // Arrange
    const currentVendor = mockVendor({
      vendor_id: 1,
      vendor_ruc: "RUC-001",
    });
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.findByTaxId.mockResolvedValue(
      mockVendor({ vendor_id: 2, vendor_ruc: "RUC-002" }),
    );
    // Act
    const act = vendorService.update(1, { vendor_ruc: "RUC-002" });
    // Assert
    await expect(act).rejects.toThrow(ConflictError);
    await expect(act).rejects.toThrow(
      "El RUC ya está registrado por otro proveedor",
    );
  });

  it("no valida unicidad si email no cambia", async () => {
    // Arrange
    const currentVendor = mockVendor({
      vendor_id: 1,
      vendor_email: "actual@example.com",
    });
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.update.mockResolvedValue({
      ...currentVendor,
      vendor_phone: "555-9999",
    });
    // Act
    await vendorService.update(1, { vendor_phone: "555-9999" });
    // Assert
    expect(vendorRepository.findByEmail).not.toHaveBeenCalled();
  });

  it("actualiza y retorna el vendor actualizado", async () => {
    // Arrange
    const currentVendor = mockVendor({ vendor_id: 1 });
    const updatedVendor = {
      ...currentVendor,
      vendor_name: "Nuevo Nombre",
    };
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.update.mockResolvedValue(updatedVendor);
    // Act
    const result = await vendorService.update(1, {
      vendor_name: "Nuevo Nombre",
    });
    // Assert
    expect(vendorRepository.update).toHaveBeenCalledWith(1, {
      vendor_name: "Nuevo Nombre",
    });
    expect(result.vendor_name).toBe("Nuevo Nombre");
  });

  it("envía evento VENDOR_UPDATED si hay cambios en campos relevantes", async () => {
    // Arrange
    const currentVendor = mockVendor({ vendor_id: 1 });
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.update.mockResolvedValue({
      ...currentVendor,
      vendor_name: "Actualizado",
    });
    // Act
    await vendorService.update(1, { vendor_name: "Actualizado" });
    // Assert
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "VENDOR_UPDATED" }),
    );
  });
});

describe("VendorService.updateStatus", () => {
  it("lanza ValidationError si status no es válido", async () => {
    // Arrange
    // Act
    const act = vendorService.updateStatus(1, "INVALID_STATUS");
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(/Estado inválido/);
  });

  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = vendorService.updateStatus(1, "ACTIVE");
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("actualiza el estado y retorna el vendor actualizado", async () => {
    // Arrange
    const currentVendor = mockVendor({
      vendor_id: 1,
      vendor_status: "PENDING",
    });
    const updatedVendor = { ...currentVendor, vendor_status: "ACTIVE" };
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.updateStatus.mockResolvedValue(updatedVendor);
    // Act
    const result = await vendorService.updateStatus(1, "ACTIVE");
    // Assert
    expect(vendorRepository.updateStatus).toHaveBeenCalledWith(1, "ACTIVE");
    expect(result.vendor_status).toBe("ACTIVE");
  });

  it("sincroniza con authClient.updateUserStatus si vendor tiene user_id", async () => {
    // Arrange
    const currentVendor = mockVendor({
      vendor_id: 1,
      user_id: 42,
      vendor_status: "PENDING",
    });
    const updatedVendor = { ...currentVendor, vendor_status: "ACTIVE" };
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.updateStatus.mockResolvedValue(updatedVendor);
    // Act
    await vendorService.updateStatus(1, "ACTIVE");
    // Assert
    expect(authClient.updateUserStatus).toHaveBeenCalledWith(42, "ACTIVE");
  });

  it("no sincroniza con auth client si vendor no tiene user_id", async () => {
    // Arrange
    const currentVendor = mockVendor({
      vendor_id: 1,
      user_id: null,
      vendor_status: "PENDING",
    });
    const updatedVendor = { ...currentVendor, vendor_status: "ACTIVE" };
    vendorRepository.findById.mockResolvedValue(currentVendor);
    vendorRepository.updateStatus.mockResolvedValue(updatedVendor);
    // Act
    await vendorService.updateStatus(1, "ACTIVE");
    // Assert
    expect(authClient.updateUserStatus).not.toHaveBeenCalled();
  });

  it("envía evento VENDOR_STATUS_CHANGED", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor({ vendor_id: 1 }));
    vendorRepository.updateStatus.mockResolvedValue(
      mockVendor({ vendor_id: 1, vendor_status: "ACTIVE" }),
    );
    // Act
    await vendorService.updateStatus(1, "ACTIVE");
    // Assert
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "VENDOR_STATUS_CHANGED" }),
    );
  });
});

describe("VendorService.getStatus", () => {
  it("retorna { vendor_id, status }", async () => {
    // Arrange
    const vendor = mockVendor({
      vendor_id: 1,
      vendor_status: "ACTIVE",
    });
    vendorRepository.findById.mockResolvedValue(vendor);
    // Act
    const result = await vendorService.getStatus(1);
    // Assert
    expect(result).toEqual({
      vendor_id: 1,
      status: "ACTIVE",
    });
  });

  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = vendorService.getStatus(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });
});

describe("VendorService.findAll", () => {
  it("llama al repositorio con los filtros", async () => {
    // Arrange
    const filters = { vendor_status: "ACTIVE" };
    vendorRepository.findAll.mockResolvedValue([mockVendor()]);
    // Act
    const result = await vendorService.findAll(filters);
    // Assert
    expect(vendorRepository.findAll).toHaveBeenCalledWith(filters);
    expect(result).toHaveLength(1);
  });

  it("llama al repositorio sin filtros si no se pasan", async () => {
    // Arrange
    vendorRepository.findAll.mockResolvedValue([]);
    // Act
    const result = await vendorService.findAll();
    // Assert
    expect(vendorRepository.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual([]);
  });
});
