const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const Controller = require("./pickupAssignment.controller");

/**
 * @swagger
 * tags:
 *   name: PickupAssignments
 *   description: Pickup assignment management
 */

/**
 * @swagger
 * /pickup-assignments:
 *   post:
 *     summary: Assign pickup request to scrap collector
 *     tags: [PickupAssignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickup_request_id
 *               - scrap_collector_id
 *             properties:
 *               pickup_request_id:
 *                 type: integer
 *                 example: 12
 *               scrap_collector_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Pickup assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pickup assigned successfully
 *       400:
 *         description: Invalid assignment
 */
router.post("/", auth, role("ADMIN"), Controller.assign);

module.exports = router;
