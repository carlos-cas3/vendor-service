jest.mock("../../repositories/branch.repository");
jest.mock("../../repositories/vendor.repository");
jest.mock("../../repositories/city.repository");
jest.mock("../../clients/analytics.client");

const branchRepository = require("../../repositories/branch.repository");
const vendorRepository = require("../../repositories/vendor.repository");
const cityRepository = require("../../repositories/city.repository");
const { sendEvent } = require("../../clients/analytics.client");
const branchService = require("../../services/branch.service");
const {
  ValidationError,
  NotFoundError,
} = require("../../utils/errors");
const { mockVendor, mockBranch } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("BranchService.create", () => {
  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.create(999, {
      city_id: 1,
      branch_address: "Calle 123",
    });
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
    await expect(act).rejects.toThrow("Proveedor no encontrado");
  });

  it("lanza ValidationError si falta city_id", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    // Act
    const act = branchService.create(1, { branch_address: "Calle 123" });
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(/city_id es requerido/);
  });

  it("lanza ValidationError si falta branch_address", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    cityRepository.findById.mockResolvedValue({ city_id: 1, city_name: "Test" });
    // Act
    const act = branchService.create(1, { city_id: 1 });
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(/branch_address es requerido/);
  });

  it("lanza ValidationError si la ciudad no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    cityRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.create(1, {
      city_id: 999,
      branch_address: "Calle 123",
    });
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(/La ciudad no existe/);
  });

  it("crea sucursal y envía evento", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    cityRepository.findById.mockResolvedValue({ city_id: 1, city_name: "Test" });
    const newBranch = mockBranch({
      branch_id: 1,
      vendor_id: 1,
      city_id: 1,
      branch_address: "Av. Central 456",
    });
    branchRepository.create.mockResolvedValue(newBranch);
    // Act
    const result = await branchService.create(1, {
      city_id: 1,
      branch_address: "Av. Central 456",
    });
    // Assert
    expect(branchRepository.create).toHaveBeenCalledWith({
      vendor_id: 1,
      city_id: 1,
      branch_name: null,
      branch_address: "Av. Central 456",
      branch_status: "ACTIVE",
    });
    expect(result).toEqual(newBranch);
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "BRANCH_CREATED" }),
    );
  });
});

describe("BranchService.findById", () => {
  it("retorna sucursal si existe", async () => {
    // Arrange
    const branch = mockBranch({ branch_id: 1 });
    branchRepository.findById.mockResolvedValue(branch);
    // Act
    const result = await branchService.findById(1);
    // Assert
    expect(result).toEqual(branch);
  });

  it("lanza NotFoundError si no existe", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.findById(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
    await expect(act).rejects.toThrow("Sucursal no encontrada");
  });
});

describe("BranchService.findActiveByVendorId", () => {
  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.findActiveByVendorId(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("retorna sucursales activas del vendor", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(mockVendor());
    branchRepository.findActiveByVendorId.mockResolvedValue([mockBranch()]);
    // Act
    const result = await branchService.findActiveByVendorId(1);
    // Assert
    expect(result).toHaveLength(1);
    expect(branchRepository.findActiveByVendorId).toHaveBeenCalledWith(1);
  });
});

describe("BranchService.findByVendorId", () => {
  it("lanza NotFoundError si vendor no existe", async () => {
    // Arrange
    vendorRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.findByVendorId(999);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });
});

describe("BranchService.updateStatus", () => {
  it("lanza ValidationError si status no es válido", async () => {
    // Arrange
    // Act
    const act = branchService.updateStatus(1, "INVALID");
    // Assert
    await expect(act).rejects.toThrow(ValidationError);
    await expect(act).rejects.toThrow(/Estado inválido/);
  });

  it("lanza NotFoundError si branch no existe", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.updateStatus(1, "ACTIVE");
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("actualiza estado y envía evento", async () => {
    // Arrange
    const branch = mockBranch({ branch_id: 1 });
    branchRepository.findById.mockResolvedValue(branch);
    branchRepository.updateStatus.mockResolvedValue({
      ...branch,
      branch_status: "MAINTENANCE",
    });
    // Act
    const result = await branchService.updateStatus(1, "MAINTENANCE");
    // Assert
    expect(branchRepository.updateStatus).toHaveBeenCalledWith(1, "MAINTENANCE");
    expect(result.branch_status).toBe("MAINTENANCE");
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "BRANCH_STATUS_CHANGED" }),
    );
  });
});

describe("BranchService.deactivate", () => {
  it("llama updateStatus con INACTIVE", async () => {
    // Arrange
    const branch = mockBranch({ branch_id: 1 });
    branchRepository.findById.mockResolvedValue(branch);
    branchRepository.updateStatus.mockResolvedValue({
      ...branch,
      branch_status: "INACTIVE",
    });
    // Act
    const result = await branchService.deactivate(1);
    // Assert
    expect(branchRepository.updateStatus).toHaveBeenCalledWith(1, "INACTIVE");
    expect(result.branch_status).toBe("INACTIVE");
  });
});

describe("BranchService.update", () => {
  it("lanza NotFoundError si branch no existe", async () => {
    // Arrange
    branchRepository.findById.mockResolvedValue(null);
    // Act
    const act = branchService.update(999, { branch_name: "Nuevo" });
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });

  it("actualiza y retorna sucursal", async () => {
    // Arrange
    const branch = mockBranch({ branch_id: 1 });
    branchRepository.findById.mockResolvedValue(branch);
    branchRepository.update.mockResolvedValue({
      ...branch,
      branch_name: "Sucursal Norte",
    });
    // Act
    const result = await branchService.update(1, {
      branch_name: "Sucursal Norte",
    });
    // Assert
    expect(branchRepository.update).toHaveBeenCalledWith(1, {
      branch_name: "Sucursal Norte",
    });
    expect(result.branch_name).toBe("Sucursal Norte");
  });
});
