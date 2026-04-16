const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
  timezone: "+05:30", // DB always UTC

  // typeCast: function (field, next) {
  //   // Handle DATETIME & TIMESTAMP
  //   if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
  //     const value = field.string();
  //     if (!value) return null;

  //     // value is UTC string -> convert to IST
  //     const utcDate = new Date(value + "Z");

  //     return new Date(
  //       utcDate.toLocaleString("en-US", {
  //         timeZone: "Asia/Kolkata",
  //       }),
  //     );
  //   }
  //   return next();
  // },
});

module.exports = pool;
