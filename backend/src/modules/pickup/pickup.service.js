const SqlHelper = require("../../config/sqlHelper");

class PickupService {
  static async create(data, createdBy) {
    console.log(data);
    const result = await SqlHelper.callSP("sp_pickup_request_create", [
      data.user_id,
      data.garbage_type_id,
      data.garbage_price_id,
      data.estimated_weight || null,
      data.price_at_request,
      data.total_amount,
      data.address,
      data.latitude || null,
      data.longitude || null,
      data.image || null,
      data.slot_id || null,
      data.request_date,
      createdBy,
    ]);

    return result[0][0].pickup_request_id;
  }

  static async getAll() {
    return SqlHelper.getAll("sp_pickup_request_get_all", []);
  }

  static async getAssigned(scrapCollectorId) {
    return SqlHelper.getAll("sp_collector_assigned_pickups", [
      scrapCollectorId,
    ]);
  }

  static async updateStatus(scrapCollectorId, pickupRequestId, status) {
    console.log("Updating status to:", scrapCollectorId);
    await SqlHelper.execute("sp_collector_update_pickup_status", [
      pickupRequestId,
      status,
      scrapCollectorId,
    ]);
  }

  static async completePickup(
    scrapCollectorId,
    pickupRequestId,
    image,
    actual_weight,
    final_price,
    user,
  ) {
    await SqlHelper.execute("sp_pickup_complete_and_wallet_debit", [
      pickupRequestId,
      scrapCollectorId,
      actual_weight,
      final_price,
      image,
      user,
    ]);
  }

  static async createGuestUser(name, phone) {
    const result = await SqlHelper.callSP("sp_guest_user_create", [
      name,
      phone,
    ]);

    return result[0][0].user_id;
  }

  static async createPickup(data, userId) {
    console.log("Creating pickup for guest user:", data);
    const result = await SqlHelper.callSP("sp_pickup_request_create", [
      userId,
      data.garbage_type_id,
      data.garbage_price_id,
      data.estimated_weight || null,
      data.price_at_request,
      data.total_amount,
      data.address,
      data.latitude || null,
      data.longitude || null,
      data.image || null,
      data.slot_id || null,
      data.request_date || null,
      "GUEST",
    ]);

    return result[0][0].pickup_request_id;
  }

  // For guest users to check their pickup status using phone number
  static async getGuestPickupStatus(data) {
    const result = await SqlHelper.callSP("sp_guest_pickup_status_by_phone", [
      data.phone,
      data.page_number,
      data.page_size,
    ]);
    console.log("Guest pickup status result:", result);
    console.log(
      "Guest pickup status result:",
      data.phone,
      data.page_number,
      data.page_size,
    );

    return {
      total_count: result?.[0]?.[0]?.total_count || 0,
      data: result?.[1] || [],
    };
  }
}

module.exports = PickupService;
