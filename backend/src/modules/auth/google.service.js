const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleService {
  static async getUserInfo(accessToken) {
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return res.data;
  }

  static async verifyIdToken(idToken) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      id: payload.sub, // Google unique ID
      email: payload.email,
      name: payload.name,
    };
  }
}

module.exports = GoogleService;
