const SqlHelper = require("../../config/sqlHelper");

class GarbageService {
  static async create(data, createdBy, imageUrl) {
    const result = await SqlHelper.callSP("sp_garbage_type_create", [
      data.name,
      imageUrl,
      createdBy,
    ]);

    return result[0][0].garbage_type_id;
  }

  static async getAll() {
    return SqlHelper.getAll("sp_garbage_type_get_all", []);
  }

  static async getById(id) {
    return SqlHelper.getOne("sp_garbage_type_get_by_id", [id]);
  }

  static async update(id, data, modifiedBy, imageUrl) {
    const result = await SqlHelper.execute("sp_garbage_type_update", [
      id,
      data.name,
      imageUrl,
      modifiedBy,
    ]);
    return result[0][0].garbage_type_id;
  }

  static async softDelete(id, deletedBy) {
    await SqlHelper.execute("sp_garbage_type_soft_delete", [id, deletedBy]);
  }
}

module.exports = GarbageService;
