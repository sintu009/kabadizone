const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/uploads", express.static(process.env.UPLOAD_BASE_PATH));
app.use("/api", routes);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

module.exports = app;
