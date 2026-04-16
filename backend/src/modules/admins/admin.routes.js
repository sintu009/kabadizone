const express = require("express");
const router = express.Router();
const AdminController = require("./admin.controller");

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management
 */

/**
 * @swagger
 * /admins/create:
 *   post:
 *     summary: Create admin user
 *     description: Create a new admin account with login credentials
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin2
 *               password:
 *                 type: string
 *                 example: Admin@123
 *               name:
 *                 type: string
 *                 example: Admin Two
 *               email:
 *                 type: string
 *                 example: admin2@mail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Bangalore
 *               gstNumber:
 *                 type: string
 *                 example: GST1234
 *               panNumber:
 *                 type: string
 *                 example: PAN1234
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */

router.post("/create", AdminController.createAdmin);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Admin dashboard summary
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_pickup_requests:
 *                       type: integer
 *                     pending_pickups:
 *                       type: integer
 *                     completed_pickups:
 *                       type: integer
 *                     cancelled_pickups:
 *                       type: integer
 *                     total_revenue:
 *                       type: integer
 *                     total_scrap_collectors:
 *                       type: integer
 *                     total_users:
 *                       type: integer
 */
router.get("/dashboard", AdminController.dashboard);

/**
 * @swagger
 * /admin/dashboard/order-summary/datewise:
 *   post:
 *     summary: Admin dashboard summary datewise
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 example: 2026-04-01
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_pickup_requests:
 *                       type: integer
 *                     pending_pickups:
 *                       type: integer
 *                     completed_pickups:
 *                       type: integer
 *                     cancelled_pickups:
 *                       type: integer
 */
router.post(
  "/dashboard/order-summary/datewise",
  AdminController.dashboardDatewise,
);

module.exports = router;
