const AuthService = require("./auth.service");
const GoogleService = require("./google.service");

class GoogleAuthController {
  static async login(req, res) {
    const { access_token } = req.body;

    // 🔐 VERIFY GOOGLE TOKEN
    const googleUser = await GoogleService.verifyIdToken(id_token);

    // 🔑 LOGIN / REGISTER
    const response = await AuthService.googleLogin(googleUser);

    res.json({
      success: true,
      ...response,
    });
  }
}

module.exports = GoogleAuthController;
