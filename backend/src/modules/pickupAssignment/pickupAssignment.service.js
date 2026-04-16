const SqlHelper = require("../../config/sqlHelper");

class PickupAssignmentService {
  static async assign(data, assignedBy) {
    await SqlHelper.execute("sp_pickup_assign", [
      data.pickup_request_id,
      data.scrap_collector_id,
      assignedBy,
    ]);
  }
}

module.exports = PickupAssignmentService;
