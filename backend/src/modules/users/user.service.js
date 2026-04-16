const SqlHelper = require("../../config/sqlHelper.js");
const bcrypt = require("bcrypt");

class UserService {
  static async createUser(data, createdBy) {
    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const result = await SqlHelper.callSP("sp_user_create_with_login", [
      data.phone, // username = phone
      passwordHash,
      salt,
      data.name,
      data.email || null,
      data.phone,
      createdBy,
    ]);

    return result[0][0].user_id;
  }

  static async updateUser(id, data, modifiedBy) {
    await SqlHelper.execute("sp_user_update", [
      id,
      data.name,
      data.email,
      modifiedBy,
    ]);
  }

  static async getUserById(id) {
    return await SqlHelper.getOne("sp_user_get_by_id", [id]);
  }

  static async getAllUsers(page = 1, limit = 10) {
    return await SqlHelper.getPaged("sp_user_get_all", [], page, limit);
  }

  static async softDeleteUser(id, deletedBy) {
    await SqlHelper.execute("sp_user_soft_delete", [id, deletedBy]);
  }
}

module.exports = UserService;
