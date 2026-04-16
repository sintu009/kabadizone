const WalletService = require("./wallet.service");

class WalletController {
  static async credit(req, res) {
    await WalletService.credit(req.body, req.user.username);
    res.json({ success: true, message: "Wallet credited" });
  }

  static async debit(req, res) {
    await WalletService.debit(req.body, req.user.username);
    res.json({ success: true, message: "Wallet debited" });
  }

  static async get(req, res) {
    const data = await WalletService.get(
      req.query.owner_type,
      req.query.owner_id,
    );
    res.json({ success: true, data });
  }

  static async transactions(req, res) {
    const data = await WalletService.transactions(
      req.query.owner_type,
      req.query.owner_id,
    );
    res.json({ success: true, data });
  }
}

module.exports = WalletController;
