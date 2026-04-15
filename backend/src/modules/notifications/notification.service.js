const SqlHelper = require("../../config/sqlHelper");
const {
  NOTIFICATION_TYPE,
  NOTIFICATION_CHANNEL,
  NOTIFICATION_USER_TYPE,
} = require("../../constants/notification.enums");

class NotificationService {
  static async create(data) {
    data.channel = data.channel || NOTIFICATION_CHANNEL.IN_APP;
    // enum validation (important)
    if (!Object.values(NOTIFICATION_TYPE).includes(data.notification_type)) {
      throw new Error("Invalid notification type");
    }

    if (!Object.values(NOTIFICATION_CHANNEL).includes(data.channel)) {
      throw new Error("Invalid notification channel");
    }

    if (!Object.values(NOTIFICATION_USER_TYPE).includes(data.recipient_type)) {
      throw new Error("Invalid recipient type");
    }

    await SqlHelper.execute("sp_notification_create", [
      data.recipient_type,
      data.recipient_id,
      data.notification_type,
      data.channel,
      data.title,
      data.message,
      data.reference_type || null,
      data.reference_id || null,
    ]);
  }

  static async getAll(recipientType, recipientId) {
    return SqlHelper.getAll("sp_notification_get", [
      recipientType,
      recipientId,
    ]);
  }

  static async markAsRead(notificationId, recipientType, recipientId) {
    await SqlHelper.execute("sp_notification_mark_read", [
      notificationId,
      recipientType,
      recipientId,
    ]);
  }
}

module.exports = NotificationService;
