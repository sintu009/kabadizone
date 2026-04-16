const AdminService = require("./admin.service");

class AdminController {
  static async createAdmin(req, res) {
    try {
      const adminId = await AdminService.createAdmin(req.body);

      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        adminId,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async dashboard(req, res) {
    const data = await AdminService.dashboardSummary();

    res.json({
      success: true,
      data,
    });
  }

  static async dashboardDatewise(req, res) {
    console.log(req);
    const data = await AdminService.dashboardOrderSummaryDatewise(req.body);
    res.json({
      success: true,
      data,
    });
  }
}

module.exports = AdminController;
