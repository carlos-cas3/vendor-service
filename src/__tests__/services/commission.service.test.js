jest.mock("../../repositories/commission.repository");
jest.mock("../../repositories/vendor.repository");

const commissionRepository = require("../../repositories/commission.repository");
const vendorRepository = require("../../repositories/vendor.repository");
const commissionService = require("../../services/commission.service");
const {
  ValidationError,
  NotFoundError,
} = require("../../utils/errors");
const { mockVendor, mockCommission } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CommissionService.findByVendorId", () => {
  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = commissionService.findByVendorId(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("retorna la primera configuración si existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    commissionRepository.findByVendorId.mockResolvedValue([
      mockCommission({ config_id: 1, commission_rate: 0.15 }),
    ]);
    // Act
    const result = await commissionService.findByVendorId(1);
    // Assert
    expect(result).toEqual(
      expect.objectContaining({ config_id: 1, commission_rate: 0.15 }),
    );
  });

  it("retorna null si no hay configuración", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    commissionRepository.findByVendorId.mockResolvedValue([]);
    // Act
    const result = await commissionService.findByVendorId(1);
    // Assert
    expect(result).toBeNull();
  });
});

describe("CommissionService.create", () => {
  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = commissionService.create(999, { commission_rate: 0.15 });
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("lanza ValidationError si commission_rate no está presente", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    // Act
    const act = commissionService.create(1, {});
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(/commission_rate es requerido/);
  });

  it("lanza ValidationError si commission_rate es menor a 0", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    // Act
    const act = commissionService.create(1, { commission_rate: -0.1 });
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(
      /commission_rate debe ser un número entre 0 y 1/,
    );
  });

  it("lanza ValidationError si commission_rate es mayor a 1", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    // Act
    const act = commissionService.create(1, { commission_rate: 1.5 });
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
  });

  it("lanza ValidationError si commission_rate no es número", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    // Act
    const act = commissionService.create(1, {
      commission_rate: "no-un-numero",
    });
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
  });

  it("crea configuración si no existe una previa", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    commissionRepository.findByVendorId.mockResolvedValue([]);
    commissionRepository.create.mockResolvedValue(
      mockCommission({ config_id: 1, commission_rate: 0.15 }),
    );
    // Act
    const result = await commissionService.create(1, {
      commission_rate: 0.15,
    });
    // Assert
    expect(commissionRepository.create).toHaveBeenCalledWith({
      vendor_id: 1,
      commission_rate: 0.15,
    });
    expect(result.commission_rate).toBe(0.15);
  });

  it("actualiza configuración existente en lugar de crear duplicado", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    commissionRepository.findByVendorId.mockResolvedValue([
      mockCommission({ config_id: 5, commission_rate: 0.10 }),
    ]);
    commissionRepository.update.mockResolvedValue(
      mockCommission({ config_id: 5, commission_rate: 0.20 }),
    );
    // Act
    const result = await commissionService.create(1, {
      commission_rate: 0.20,
    });
    // Assert
    expect(commissionRepository.update).toHaveBeenCalledWith(5, 0.20);
    expect(commissionRepository.create).not.toHaveBeenCalled();
    expect(result.commission_rate).toBe(0.20);
  });
});

describe("CommissionService.update", () => {
  it("lanza NotFoundError si configuración no existe", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(null);
    // Act
    const act = commissionService.update(999, { commission_rate: 0.15 });
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
    await expect(act).rejects.toThrow("Configuración no encontrada");
  });

  it("actualiza y retorna configuración", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(
      mockCommission({ config_id: 1 }),
    );
    commissionRepository.update.mockResolvedValue(
      mockCommission({ config_id: 1, commission_rate: 0.25 }),
    );
    // Act
    const result = await commissionService.update(1, {
      commission_rate: 0.25,
    });
    // Assert
    expect(commissionRepository.update).toHaveBeenCalledWith(1, 0.25);
    expect(result.commission_rate).toBe(0.25);
  });
});

describe("CommissionService.delete", () => {
  it("lanza NotFoundError si configuración no existe", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(null);
    // Act
    const act = commissionService.delete(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("elimina configuración y retorna true", async () => {
    // Arrange
    commissionRepository.findById.mockResolvedValue(
      mockCommission({ config_id: 1 }),
    );
    commissionRepository.delete.mockResolvedValue(true);
    // Act
    const result = await commissionService.delete(1);
    // Assert
    expect(commissionRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });
});
