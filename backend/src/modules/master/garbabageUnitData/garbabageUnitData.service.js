const SqlHelper = require("../../../config/sqlHelper.js");

class GarbabageUnitDataService {
  static async getUnitData() {
    return SqlHelper.getAll("sp_get_master_garbage_unit_data", []);
  }
}

module.exports = GarbabageUnitDataService;
