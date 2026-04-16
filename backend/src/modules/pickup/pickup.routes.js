const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const upload = require("../../middlewares/upload.middleware");

const PickupController = require("./pickup.controller");

/**
 * @swagger
 * tags:
 *   name: PickupRequests
 *   description: Pickup request management
 */

/**
 * @swagger
 * /pickup-requests:
 *   post:
 *     summary: Create pickup request
 *     tags: [PickupRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - garbage_type_id
 *               - unit
 *               - price_at_request
 *               - total_amount
 *               - request_date
 *               - slot_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               garbage_type_id:
 *                 type: integer
 *                 example: 2
 *               garbage_price_id:
 *                 type: integer
 *                 example: 2
 *               estimated_weight:
 *                 type: number
 *                 example: 5
 *               price_at_request:
 *                 type: number
 *                 example: 15
 *               total_amount:
 *                 type: number
 *                 example: 75
 *               address:
 *                 type: string
 *                 example: Bangalore, Whitefield
 *               latitude:
 *                 type: number
 *                 example: 12.9716
 *               longitude:
 *                 type: number
 *                 example: 77.5946
 *               image:
 *                 type: string
 *                 example: image.jpg
 *               slot_id:
 *                 type: number
 *                 example: 1
 *               request_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *     responses:
 *       201:
 *         description: Pickup request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 */
router.post("/", auth, role("ADMIN", "USER"), PickupController.create);

/**
 * @swagger
 * /pickup-requests:
 *   get:
 *     summary: Get all pickup requests
 *     tags: [PickupRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pickup requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_name:
 *                         type: string
 *                       garbage_type:
 *                         type: string
 *                       estimated_weight:
 *                         type: number
 *                       unit:
 *                         type: integer
 *                       total_amount:
 *                         type: number
 *                       status:
 *                         type: string
 */
router.get("/", auth, role("ADMIN"), PickupController.getAll);

/**
 * @swagger
 * /pickup-requests/pickups:
 *   get:
 *     summary: Get assigned pickup requests
 *     tags: [PickupRequests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned pickups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pickup_request_id:
 *                         type: integer
 *                       user_name:
 *                         type: string
 *                       phone_number:
 *                         type: string
 *                       garbage_type:
 *                         type: string
 *                       estimated_weight:
 *                         type: number
 *                       unit:
 *                         type: integer
 *                       total_amount:
 *                         type: number
 *                       status:
 *                         type: string
 */
router.get("/pickups", auth, role("COLLECTOR"), PickupController.getAssigned);

/**
 * @swagger
 * /pickup-requests/pickups/{pickupRequestId}/status:
 *   put:
 *     summary: Update pickup status
 *     tags: [PickupRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pickupRequestId
 *         required: true
 *         description: ID of the pickup request
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status of the pickup
 *                 enum:
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *                   - CANCELLED
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image for proof
 *               actual_weight:
 *                 type: number
 *                 description: Actual weight of the pickup (optional)
 *                 example: 2
 *               final_price:
 *                 type: number
 *                 description: Final price for the pickup (optional)
 *                 example: 30
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: Status updated successfully
 */
router.put(
  "/pickups/:pickupRequestId/status",
  auth,
  role("COLLECTOR"),
  upload.single("image"),
  PickupController.updateStatus,
);

/**
 * @swagger
 * /pickup-requests/guest:
 *   post:
 *     summary: Create pickup request as guest
 *     tags: [PickupRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - garbage_type_id
 *               - unit
 *               - price_at_request
 *               - total_amount
 *               - request_date
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               garbage_type_id:
 *                 type: integer
 *                 example: 1
 *               estimated_weight:
 *                 type: number
 *                 example: 5
 *               garbage_price_id:
 *                 type: integer
 *                 example: 1
 *               price_at_request:
 *                 type: number
 *                 example: 15
 *               total_amount:
 *                 type: number
 *                 example: 75
 *               address:
 *                 type: string
 *                 example: Whitefield, Bangalore
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               image:
 *                 type: string
 *               slot_id:
 *                 type: number
 *                 example: 1
 *               request_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *     responses:
 *       201:
 *         description: Pickup created
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
 *                 pickup_request_id:
 *                   type: integer
 */
router.post("/guest", PickupController.guestPickup);

/**
 * @swagger
 * /pickup-requests/guest/status:
 *   post:
 *     summary: Get pickup status by phone (Guest)
 *     tags: [PickupRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               page_number:
 *                 type: integer
 *                 example: 1
 *                 default: 1
 *               page_size:
 *                 type: integer
 *                 example: 10
 *                 default: 10
 *     responses:
 *       200:
 *         description: Pickup status list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total_count:
 *                   type: integer
 *                 page_number:
 *                   type: integer
 *                 page_size:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pickup_request_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       address:
 *                         type: string
 *                       created_on:
 *                         type: string
 *                         format: date-time
 *                       estimated_weight:
 *                         type: number
 *                       actual_weight:
 *                         type: number
 *                       total_amount:
 *                         type: number
 *                       final_amount:
 *                         type: number
 */
router.post("/guest/status", PickupController.guestStatus);

module.exports = router;
