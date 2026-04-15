const SqlHelper = require("../../config/sqlHelper.js");

class GarbagePriceService {
  static async create(data, createdBy) {
    const result = await SqlHelper.callSP("sp_garbage_price_create", [
      data.garbage_type_id,
      data.unit,
      data.price_per_unit,
      createdBy,
      data.name,
    ]);

    return result[0][0].garbage_price_id;
  }

  static async getAll() {
    return SqlHelper.getAll("sp_garbage_price_get_all", []);
  }

  static async getById(id) {
    return SqlHelper.getOne("sp_garbage_price_get_by_id", [id]);
  }

  static async update(id, data, modifiedBy) {
    const result = await SqlHelper.callSP("sp_garbage_price_update", [
      id,
      data.name,
      data.unit,
      data.price_per_unit,
      modifiedBy,
    ]);
    console.log(result);
    return result[0][0].garbage_price_id;
  }

  static async deactivate(id, modifiedBy) {
    await SqlHelper.execute("sp_garbage_price_deactivate", [id, modifiedBy]);
  }
}

module.exports = GarbagePriceService;
