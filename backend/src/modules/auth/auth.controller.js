const bcrypt = require("bcrypt");
const AuthService = require("./auth.service.js");

class AuthController {
  static async login(req, res) {
    try {
      console.log("Login Request Body:", req.body);
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      const result = await AuthService.login(username, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      console.log("Reset Password Request Body:", req.body);
      const { role, phoneNumber } = req.body;

      if (!role || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Role and phoneNumber are required",
        });
      }

      if (!["ADMIN", "USER", "COLLECTOR"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      // DEFAULT PASSWORD = PHONE NUMBER
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(phoneNumber, salt);

      await AuthService.resetPasswordByRoleAndPhone(
        role,
        phoneNumber,
        passwordHash,
        salt,
        "SuperAdmin", // admin performing reset
      );

      return res.status(200).json({
        success: true,
        message: "Password reset successful",
        defaultPassword: phoneNumber,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = AuthController;
