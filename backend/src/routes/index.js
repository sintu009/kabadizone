const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
const adminRoutes = require("../modules/admins/admin.routes");
const scrapCollectorRoutes = require("../modules/scrapCollectors/scrapCollector.routes");
const garbageRoutes = require("../modules/garbage/garbage.routes.js");
const garbagePriceRoutes = require("../modules/pricing/garbagePricing.routes");
const pickupRoutes = require("../modules/pickup/pickup.routes");
const pickupAssignmentRoutes = require("../modules/pickupAssignment/pickupAssignment.routes");
const masterGarbageUnitRoutes = require("../modules/master/garbabageUnitData/garbabageUnitData.routes");
const walletRoutes = require("../modules/wallets/wallet.routes");
const notificationRoutes = require("../modules/notifications/notification.routes");
const slotTimeRoutes = require("../modules/slotTimes/slotTime.routes");

const router = express.Router();

/* ===============================
   ROUTE MAPPING
================================ */
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/scrap-collectors", scrapCollectorRoutes);
router.use("/garbage-types", garbageRoutes);
router.use("/garbage-prices", garbagePriceRoutes);
router.use("/pickup-requests", pickupRoutes);
router.use("/pickup-assignments", pickupAssignmentRoutes);
router.use("/master-garbage-unit", masterGarbageUnitRoutes);
router.use("/wallets", walletRoutes);
router.use("/notifications", notificationRoutes);
router.use("/slot-times", slotTimeRoutes);

module.exports = router;
