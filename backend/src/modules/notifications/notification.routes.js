const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const Controller = require("./notification.controller");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification APIs
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification list
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
 *                       notification_type:
 *                         type: string
 *                       channel:
 *                         type: string
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       reference_type:
 *                         type: string
 *                       reference_id:
 *                         type: integer
 *                       is_read:
 *                         type: boolean
 *                       created_on:
 *                         type: string
 *                         format: date-time
 */
router.get("/", auth, Controller.get);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.put("/:id/read", auth, Controller.markRead);

module.exports = router;
