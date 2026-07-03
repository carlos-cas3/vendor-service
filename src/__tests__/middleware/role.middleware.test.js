const { requireRole } = require("../../middleware/role.middleware");

describe("requireRole", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("rechaza si req.user no tiene roleId", () => {
    // Arrange
    req.user = {};
    const middleware = requireRole([2]);
    // Act
    middleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No tienes permisos para esta acción",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rechaza si roleId no está en la lista permitida", () => {
    // Arrange
    req.user = { roleId: 4, vendorId: 1 };
    const middleware = requireRole([2]);
    // Act
    middleware(req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("permite si roleId está en la lista permitida", () => {
    // Arrange
    req.user = { roleId: 2, vendorId: 1 };
    const middleware = requireRole([1, 2]);
    // Act
    middleware(req, res, next);
    // Assert
    expect(next).toHaveBeenCalled();
  });
});
