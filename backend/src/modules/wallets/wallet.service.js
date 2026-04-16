const SqlHelper = require("../../config/sqlHelper.js");

class WalletService {
  static credit(data, admin) {
    return SqlHelper.execute("sp_wallet_credit", [
      data.owner_type,
      data.owner_id,
      data.amount,
      data.remarks || null,
      admin,
    ]);
  }

  static debit(data, admin) {
    return SqlHelper.execute("sp_wallet_debit", [
      data.owner_type,
      data.owner_id,
      data.amount,
      data.remarks || null,
      admin,
    ]);
  }

  static get(ownerType, ownerId) {
    return SqlHelper.getOne("sp_wallet_get", [ownerType, ownerId]);
  }

  static transactions(ownerType, ownerId) {
    return SqlHelper.getAll("sp_wallet_transactions", [ownerType, ownerId]);
  }
}

module.exports = WalletService;
