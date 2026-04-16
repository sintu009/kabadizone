const PickupAssignmentService = require("./pickupAssignment.service");

class PickupAssignmentController {
  static async assign(req, res) {
    await PickupAssignmentService.assign(req.body, req.user.username);

    res.json({
      success: true,
      message: "Pickup assigned successfully",
    });
  }
}

module.exports = PickupAssignmentController;
