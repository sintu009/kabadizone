const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

const SlotTimeController = require("./slotTime.controller");

/**
 * @swagger
 * tags:
 *   name: SlotTime
 *   description: Slot time management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SlotTime:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         start_time:
 *           type: string
 *           example: "10:00:00"
 *         end_time:
 *           type: string
 *           example: "11:00:00"
 *         added_by:
 *           type: string
 *           example: "admin"
 *         added_on:
 *           type: string
 *           example: "2026-03-29T10:00:00Z"
 *     SlotTimeCreate:
 *       type: object
 *       required:
 *         - start_time
 *         - end_time
 *       properties:
 *         start_time:
 *           type: string
 *           example: "10:00:00"
 *         end_time:
 *           type: string
 *           example: "11:00:00"
 *     SlotTimeUpdate:
 *       type: object
 *       required:
 *         - id
 *         - start_time
 *         - end_time
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         start_time:
 *           type: string
 *           example: "10:30:00"
 *         end_time:
 *           type: string
 *           example: "11:30:00"
 */

/**
 * @swagger
 * /slot-times:
 *   get:
 *     summary: Get all slot times
 *     tags: [SlotTime]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of slot times
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SlotTime'
 */
router.get("/", auth, role("ADMIN", "USER"), SlotTimeController.getSlotTimes);

/**
 * @swagger
 * /slot-times/{id}:
 *   get:
 *     summary: Get slot time by ID
 *     tags: [SlotTime]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Slot ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Slot details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SlotTime'
 *       404:
 *         description: Slot not found
 */
router.get(
  "/:id",
  auth,
  role("ADMIN", "USER"),
  SlotTimeController.getSlotTimeById,
);

/**
 * @swagger
 * /slot-times:
 *   post:
 *     summary: Create slot time
 *     tags: [SlotTime]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SlotTimeCreate'
 *     responses:
 *       200:
 *         description: Slot created successfully
 *       400:
 *         description: Duplicate slot or validation error
 */
router.post("/", auth, role("ADMIN"), SlotTimeController.createSlotTime);

/**
 * @swagger
 * /slot-times/{id}:
 *   put:
 *     summary: Update slot time
 *     tags: [SlotTime]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Slot ID
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_time
 *               - end_time
 *             properties:
 *               start_time:
 *                 type: string
 *                 example: "10:30:00"
 *               end_time:
 *                 type: string
 *                 example: "11:30:00"
 *     responses:
 *       200:
 *         description: Slot updated successfully
 */
router.put("/:id", auth, role("ADMIN"), SlotTimeController.updateSlotTime);

/**
 * @swagger
 * /slot-times/{id}:
 *   delete:
 *     summary: Delete slot time
 *     tags: [SlotTime]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Slot ID to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Slot deleted successfully
 */
router.delete("/:id", auth, role("ADMIN"), SlotTimeController.deleteSlotTime);

module.exports = router;
