const PickupService = require("./pickup.service");

class PickupController {
  static async create(req, res) {
    const id = await PickupService.create(
      req.body,
      req.user ? req.user.username : "GUEST",
    );

    res.status(201).json({
      success: true,
      message: "Pickup request created",
      id,
    });
  }

  static async getAll(req, res) {
    const data = await PickupService.getAll();

    res.json({
      success: true,
      data,
    });
  }

  static async getAssigned(req, res) {
    const data = await PickupService.getAssigned(req.user.user_id);

    res.json({
      success: true,
      data,
    });
  }

  static async updateStatus(req, res) {
    const { status, actual_weight, final_price } = req.body;
    const image = req.file; // multer puts the uploaded file info here
    const { pickupRequestId } = req.params;
    const scrapCollectorId = req.user.user_id;
    const username = req.user.username;

    console.log("Updating status to:", pickupRequestId, status);
    // COMPLETED = special business flow
    if (status === "COMPLETED") {
      const imagePath = image ? image.filename : null;
      await PickupService.completePickup(
        scrapCollectorId,
        pickupRequestId,
        imagePath,
        actual_weight,
        final_price,
        username,
      );

      return res.json({
        success: true,
        message: "Pickup completed and wallet debited",
      });
    }

    await PickupService.updateStatus(
      scrapCollectorId,
      pickupRequestId,
      status,
      username,
    );

    res.json({
      success: true,
      message: "Pickup status updated",
    });
  }

  static async guestPickup(req, res) {
    console.log("Received guest pickup request:", req.body);
    const {
      name,
      phone,
      garbage_type_id,
      estimated_weight,
      garbage_price_id,
      unit,
      price_at_request,
      total_amount,
      address,
      latitude,
      longitude,
      image,
      slot_id,
      request_date,
    } = req.body;

    // 1️⃣ Create / reuse guest user
    const userId = await PickupService.createGuestUser(name, phone);

    // 2️⃣ Create pickup request
    const pickupId = await PickupService.createPickup(
      {
        garbage_type_id,
        garbage_price_id,
        estimated_weight,
        unit,
        price_at_request,
        total_amount,
        address,
        latitude,
        longitude,
        image,
        slot_id,
        request_date,
      },
      userId,
    );

    res.status(201).json({
      success: true,
      message: "Pickup request created",
      pickup_request_id: pickupId,
    });
  }

  // For guest users to check their pickup status using phone number
  static async guestStatus(req, res) {
    console.log(req.body);
    const { phone, page_number = 1, page_size = 10 } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const result = await PickupService.getGuestPickupStatus({
      phone,
      page_number,
      page_size,
    });

    res.json({
      success: true,
      total_count: result.total_count,
      page_number,
      page_size,
      data: result.data,
    });
  }
}

module.exports = PickupController;
