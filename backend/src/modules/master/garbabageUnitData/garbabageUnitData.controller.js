const GarbabageUnitDataService = require("./garbabageUnitData.service.js");

class GarbabageUnitDataController {
  static async getGarbabageUnitData(req, res) {
    console.log("Fetching garbage unit data");
    const garbageUnitData = await GarbabageUnitDataService.getUnitData();
    res.json({ success: true, data: garbageUnitData });
  }
}

module.exports = GarbabageUnitDataController;
