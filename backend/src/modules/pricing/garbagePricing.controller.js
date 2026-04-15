const GarbagePriceService = require("./garbagePricing.service");

class GarbagePriceController {
  static async create(req, res) {
    const id = await GarbagePriceService.create(req.body, req.user.username);

    if (id == -1) {
      res.status(200).json({
        success: false,
        message: "Garbage price already exists",
        id,
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Garbage price created",
        id,
      });
    }
  }

  static async getAll(req, res) {
    const data = await GarbagePriceService.getAll();
    res.json({ success: true, data });
  }

  static async getById(req, res) {
    const data = await GarbagePriceService.getById(req.params.id);
    console.log(data);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Garbage price not found",
      });
    }

    res.json({ success: true, data });
    console.log(res);
  }

  static async update(req, res) {
    const id = await GarbagePriceService.update(
      req.params.id,
      req.body,
      req.user.username,
    );

    if (id == -1) {
      return res.status(200).json({
        success: false,
        message: "Garbage price already exists",
        id,
      });
    } else {
      res.json({
        success: true,
        message: "Garbage price updated",
      });
    }
  }

  static async deactivate(req, res) {
    await GarbagePriceService.deactivate(req.params.id, req.user.username);

    res.json({
      success: true,
      message: "Garbage price deactivated",
    });
  }
}

module.exports = GarbagePriceController;
