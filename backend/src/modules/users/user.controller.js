const UserService = require("./user.service");

class UserController {
  static async create(req, res) {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    const userId = await UserService.createUser(
      req.body,
      req.user?.username || "SYSTEM",
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId,
    });
  }

  static async update(req, res) {
    await UserService.updateUser(req.params.id, req.body, req.user.username);

    res.json({
      success: true,
      message: "User updated successfully",
    });
  }

  static async getById(req, res) {
    const user = await UserService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  }

  static async getAll(req, res) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await UserService.getAllUsers(page, limit);

    res.json({
      success: true,
      ...result,
    });
  }

  static async softDelete(req, res) {
    await UserService.softDeleteUser(req.params.id, req.user.username);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  }
}

module.exports = UserController;
