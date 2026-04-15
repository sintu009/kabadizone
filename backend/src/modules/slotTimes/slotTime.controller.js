const SlotTimeService = require("./slotTime.service.js");

class SlotTimeController {
  static async getSlotTimes(req, res) {
    try {
      const data = await SlotTimeService.getSlotTimes();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createSlotTime(req, res) {
    try {
      const payload = {
        ...req.body,
        added_by: req.user?.username || "system",
      };

      const result = await SlotTimeService.createSlotTime(payload);

      // 🔴 Handle duplicate
      if (result.id === -1) {
        return res.status(400).json({
          success: false,
          message: "Slot already exists with same time",
        });
      }

      // ✅ Success
      res.json({
        success: true,
        message: "Slot created successfully",
        id: result.id,
      });
    } catch (error) {
      console.error("Create slot error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create slot",
      });
    }
  }

  static async getSlotTimeById(req, res) {
    try {
      const id = req.params.id;

      const data = await SlotTimeService.getSlotTimeById(id);

      if (!data || data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Slot not found",
        });
      }

      res.json({ success: true, data: data[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateSlotTime(req, res) {
    try {
      console.log(
        "Received update request for slot:",
        req.params.id,
        "with body:",
        req.body,
      );
      const payload = {
        id: req.params.id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        modified_by: req.user?.username || "system",
      };

      const result = await SlotTimeService.updateSlotTime(payload);

      if (result.id === -1) {
        return res.status(400).json({
          success: false,
          message: "Slot already exists with same time",
        });
      }

      res.json({ success: true, message: "Slot updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteSlotTime(req, res) {
    try {
      const payload = {
        id: req.params.id,
        modified_by: req.user?.username || "system",
      };

      await SlotTimeService.deleteSlotTime(payload);

      res.json({ success: true, message: "Slot deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = SlotTimeController;
