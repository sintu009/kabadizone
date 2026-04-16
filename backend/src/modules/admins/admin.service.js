const SqlHelper = require("../../config/sqlHelper");
const bcrypt = require("bcrypt");

class AdminService {
  static async createAdmin(data, createdBy = "Super Admin") {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const out = await SqlHelper.callSPWithOut(
      "sp_admin_create",
      [
        data.username,
        passwordHash,
        salt,
        data.name,
        data.email,
        data.phone,
        data.address,
        data.gstNumber,
        data.panNumber,
        createdBy,
      ],
      ["o_admin_id"],
    );

    return out.o_admin_id;
  }

  static async dashboardSummary() {
    const result = await SqlHelper.callSP("sp_admin_dashboard_summary", []);

    return result?.[0]?.[0];
  }

  static async dashboardOrderSummaryDatewise(data) {
    const result = await SqlHelper.callSP(
      "sp_admin_dashboard_order_summary_datewise",
      [data.date],
    );

    return result?.[0]?.[0];
  }
}

module.exports = AdminService;
