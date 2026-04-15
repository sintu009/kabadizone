const SqlHelper = require("../../config/sqlHelper.js");

class SlotTimeService {
  static async getSlotTimes() {
    return SqlHelper.getAll("sp_slot_times_get_all", []);
  }

  static async createSlotTime(data) {
    const { start_time, end_time, added_by } = data;

    const result = await SqlHelper.getAll("sp_slot_times_insert", [
      start_time,
      end_time,
      added_by,
    ]);

    return result[0]; // contains { id: value }
  }

  static async getSlotTimeById(id) {
    return SqlHelper.getAll("sp_slot_times_get_by_id", [id]);
  }

  static async updateSlotTime(data) {
    console.log("Updating slot with data:", data);
    const { id, start_time, end_time, modified_by } = data;
    const result = await SqlHelper.getAll("sp_slot_times_update", [
      id,
      start_time,
      end_time,
      modified_by,
    ]);

    return result[0];
  }

  static async deleteSlotTime(data) {
    const { id, modified_by } = data;
    return SqlHelper.execute("sp_slot_times_delete", [id, modified_by]);
  }
}

module.exports = SlotTimeService;
