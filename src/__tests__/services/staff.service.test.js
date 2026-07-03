jest.mock("../../clients/auth.client");
jest.mock("../../repositories/staff.repository");
jest.mock("../../clients/analytics.client");

const authClient = require("../../clients/auth.client");
const staffRepository = require("../../repositories/staff.repository");
const { sendEvent } = require("../../clients/analytics.client");
const staffService = require("../../services/staff.service");
const {
  ConflictError,
  NotFoundError,
} = require("../../utils/errors");
const { mockStaff } = require("../helpers/mocks");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("StaffService.createStaff", () => {
  it("crea usuario en auth-client y luego staff local", async () => {
    // Arrange
    const data = {
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan@vendor.com",
      role_id: 3,
    };
    const vendor_id = 1;
    const authResult = { user_id: 10 };
    authClient.createInternalUser.mockResolvedValue(authResult);
    staffRepository.create.mockResolvedValue(mockStaff({ staff_id: 1 }));
    // Act
    const result = await staffService.createStaff(data, vendor_id);
    // Assert
    expect(authClient.createInternalUser).toHaveBeenCalledWith({
      ...data,
      vendor_id,
    });
    expect(staffRepository.create).toHaveBeenCalledWith({
      user_id: 10,
      vendor_id,
      ...data,
      personal_phone: undefined,
    });
    expect(result).toBeDefined();
  });

  it("lanza error si falla creación local después de crear en auth", async () => {
    // Arrange
    authClient.createInternalUser.mockResolvedValue({ user_id: 10 });
    staffRepository.create.mockRejectedValue(new Error("DB error"));
    // Act
    const act = staffService.createStaff(
      { first_name: "Juan", last_name: "Pérez", email: "juan@vendor.com", role_id: 3 },
      1,
    );
    // Assert
    await expect(act).rejects.toThrow(
      "Error al guardar el staff localmente",
    );
  });

  it("envía evento STAFF_CREATED", async () => {
    // Arrange
    authClient.createInternalUser.mockResolvedValue({ user_id: 10 });
    staffRepository.create.mockResolvedValue(mockStaff({ staff_id: 1 }));
    // Act
    await staffService.createStaff(
      { first_name: "Juan", last_name: "Pérez", email: "juan@vendor.com", role_id: 3 },
      1,
    );
    // Assert
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "STAFF_CREATED" }),
    );
  });
});

describe("StaffService.getStaff", () => {
  it("retorna staff activo del vendor", async () => {
    // Arrange
    staffRepository.findByVendorId.mockResolvedValue([mockStaff()]);
    // Act
    const result = await staffService.getStaff(1);
    // Assert
    expect(staffRepository.findByVendorId).toHaveBeenCalledWith(1);
    expect(result).toHaveLength(1);
  });
});

describe("StaffService.getStaffById", () => {
  it("retorna staff si existe y pertenece al vendor", async () => {
    // Arrange
    const staff = mockStaff({ staff_id: 1, vendor_id: 1 });
    staffRepository.findById.mockResolvedValue(staff);
    // Act
    const result = await staffService.getStaffById(1, 1);
    // Assert
    expect(result).toEqual(staff);
  });

  it("lanza NotFoundError si staff no existe", async () => {
    // Arrange
    staffRepository.findById.mockResolvedValue(null);
    // Act
    const act = staffService.getStaffById(999, 1);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
    await expect(act).rejects.toThrow("Staff no encontrado");
  });

  it("lanza NotFoundError si staff no pertenece al vendor", async () => {
    // Arrange
    const staff = mockStaff({ staff_id: 1, vendor_id: 2 });
    staffRepository.findById.mockResolvedValue(staff);
    // Act
    const act = staffService.getStaffById(1, 99);
    // Assert
    await expect(act).rejects.toThrow(NotFoundError);
  });
});

describe("StaffService.updateStaff", () => {
  it("lanza ConflictError si el email ya está registrado para otro staff", async () => {
    // Arrange
    staffRepository.findById.mockResolvedValue(
      mockStaff({ staff_id: 1, vendor_id: 1, email: "actual@vendor.com" }),
    );
    staffRepository.findByEmail.mockResolvedValue(
      mockStaff({ staff_id: 2, vendor_id: 1, email: "otro@vendor.com" }),
    );
    // Act
    const act = staffService.updateStaff(1, 1, {
      email: "otro@vendor.com",
    });
    // Assert
    await expect(act).rejects.toThrow(ConflictError);
    await expect(act).rejects.toThrow(
      "El email ya está registrado para otro staff de este vendor",
    );
  });

  it("actualiza staff y sincroniza con auth-client", async () => {
    // Arrange
    const staff = mockStaff({ staff_id: 1, vendor_id: 1, user_id: 10 });
    staffRepository.findById.mockResolvedValue(staff);
    staffRepository.update.mockResolvedValue({
      ...staff,
      first_name: "Juan Actualizado",
    });
    // Act
    const result = await staffService.updateStaff(1, 1, {
      first_name: "Juan Actualizado",
    });
    // Assert
    expect(authClient.updateUser).toHaveBeenCalledWith(10, {
      first_name: "Juan Actualizado",
    });
    expect(staffRepository.update).toHaveBeenCalledWith(1, {
      first_name: "Juan Actualizado",
    });
    expect(result.first_name).toBe("Juan Actualizado");
  });
});

describe("StaffService.deactivateStaff", () => {
  it("desactiva staff y sincroniza con auth-client", async () => {
    // Arrange
    const staff = mockStaff({ staff_id: 1, vendor_id: 1, user_id: 10 });
    staffRepository.findById.mockResolvedValue(staff);
    staffRepository.updateStatus.mockResolvedValue({
      ...staff,
      status: "INACTIVE",
    });
    // Act
    const result = await staffService.deactivateStaff(1, 1);
    // Assert
    expect(authClient.updateUserStatus).toHaveBeenCalledWith(10, "INACTIVE");
    expect(staffRepository.updateStatus).toHaveBeenCalledWith(1, "INACTIVE");
    expect(result.status).toBe("INACTIVE");
    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "STAFF_STATUS_CHANGED" }),
    );
  });
});
