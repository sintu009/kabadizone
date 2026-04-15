require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

/* ==============================
   MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger.js");

/** ===========================
 *  SWAGGER SETUP
 */

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

/* ==============================
   HEALTH CHECK
================================ */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Server is running",
  });
});

/* ==============================
   ROUTES
================================ */
app.use("/api", require("./src/routes"));

/* ==============================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* ==============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ==============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
