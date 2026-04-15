const SqlHelper = require("../../config/sqlHelper.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  static async login(username, password) {
    console.log("AuthService.login called with:", username, password);
    const user = await SqlHelper.getOne("sp_auth_get_by_username", [username]);
    console.log("AuthService.login called with:", user.password_hash);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (!user.is_active) {
      throw new Error("Account is disabled");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        user_id: user.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        user_id: user.user_id,
      },
    };
  }

  static async googleLogin(googleUser) {
    // 1️⃣ Check existing google auth
    const result = await SqlHelper.callSP("sp_auth_get_by_google", [
      googleUser.id,
    ]);

    let authUser = result?.[0]?.[0];

    // 2️⃣ If not exists → create auth + user
    if (!authUser) {
      const authResult = await SqlHelper.callSP("sp_auth_create", [
        googleUser.email, // username
        null, // password_hash
        null, // salt
        "USER",
        "GOOGLE",
        googleUser.id,
      ]);

      const authUserId = authResult[0][0].auth_user_id;

      const userResult = await SqlHelper.callSP("sp_user_create_registered", [
        googleUser.name,
        googleUser.email,
        "REGISTERED",
        authUserId,
      ]);

      authUser = {
        id: authUserId,
        username: googleUser.email,
        role: "USER",
        user_id: userResult[0][0].user_id,
      };
    }

    return this._generateResponse(authUser);
  }

  static async resetPasswordByRoleAndPhone(
    role,
    phoneNumber,
    passwordHash,
    salt,
    resetBy,
  ) {
    await SqlHelper.callSP("sp_auth_reset_password_by_phone_and_role", [
      role,
      phoneNumber,
      passwordHash,
      salt,
      resetBy,
    ]);
  }

  static _generateResponse(user) {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        user_id: user.user_id || null,
        scrap_collector_id: user.scrap_collector_id || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        user_id: user.user_id || null,
        scrap_collector_id: user.scrap_collector_id || null,
      },
    };
  }
}

module.exports = AuthService;
