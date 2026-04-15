const SqlHelper = require("../../config/sqlHelper.js");
const bcrypt = require("bcrypt");

class ScrapCollectorService {
  static async create(data, createdBy) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.phone, salt);

    const result = await SqlHelper.callSP("sp_scrap_collector_create", [
      data.phone,
      passwordHash,
      salt,
      data.name,
      data.email || null,
      data.phone,
      data.blood_group,
      data.gender,
      createdBy,
    ]);

    return result[0][0].scrap_collector_id;
  }

  static async getAll(page, limit) {
    return SqlHelper.getPaged("sp_scrap_collector_get_all", [], page, limit);
  }

  static async getById(id) {
    return SqlHelper.getOne("sp_scrap_collector_get_by_id", [id]);
  }

  static async update(id, data, modifiedBy) {
    await SqlHelper.execute("sp_scrap_collector_update", [
      id,
      data.name,
      data.email,
      data.phone,
      data.blood_group,
      data.gender,
      modifiedBy,
    ]);
  }

  static async softDelete(id, deletedBy) {
    await SqlHelper.execute("sp_scrap_collector_soft_delete", [id, deletedBy]);
  }

  static async getDropdown() {
    console.log("Called Service");
    return SqlHelper.getAll("sp_scrap_collector_dropdown", []);
  }

  static async dashboardSummary(scrapCollectorId) {
    const result = await SqlHelper.callSP("sp_collector_dashboard_summary", [
      scrapCollectorId,
    ]);

    return result?.[0]?.[0];
  }
}

module.exports = ScrapCollectorService;
