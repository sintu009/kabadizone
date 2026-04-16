const NotificationService = require("./notification.service");

class NotificationController {
  static async get(req, res) {
    const data = await NotificationService.getAll(
      req.user.role, // ADMIN / USER / SCRAP_COLLECTOR
      req.user.id, // mapped user / collector id
    );

    res.json({
      success: true,
      data,
    });
  }

  static async markRead(req, res) {
    await NotificationService.markAsRead(
      req.params.id,
      req.user.role,
      req.user.id,
    );

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  }
}

module.exports = NotificationController;
