const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const GarbagePricingController = require("./garbagePricing.controller");

/**
 * @swagger
 * tags:
 *   name: GarbagePrices
 *   description: Garbage Pricing management
 */

/**
 * @swagger
 * /garbage-prices:
 *   post:
 *     summary: Create garbage price
 *     tags: [GarbagePrices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, garbage_type_id, unit, price_per_unit]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Plastic
 *               garbage_type_id:
 *                 type: integer
 *                 example: 1
 *               unit:
 *                 type: integer
 *                 example: 1
 *               price_per_unit:
 *                 type: number
 *                 example: 12.5
 *     responses:
 *       201:
 *         description: Garbage price created
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
 *                   example: Garbage price created
 *                 id:
 *                   type: integer
 *                   example: 10
 */
router.post("/", auth, role("ADMIN"), GarbagePricingController.create);

/**
 * @swagger
 * /garbage-prices:
 *   get:
 *     summary: Get all garbage prices
 *     tags: [GarbagePrices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of garbage prices
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       garbage_type_id:
 *                         type: integer
 *                         example: 2
 *                       garbage_type_name:
 *                         type: string
 *                         example: Plastic
 *                       unit:
 *                         type: integer
 *                         example: 1
 *                       price_per_unit:
 *                         type: number
 *                         example: 15
 */
router.get("/", auth, role("ADMIN"), GarbagePricingController.getAll);

/**
 * @swagger
 * /garbage-prices/{id}:
 *   get:
 *     summary: Get garbage price by ID
 *     tags: [GarbagePrices]
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
 *         description: Garbage price details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     garbage_type_id:
 *                       type: integer
 *                       example: 2
 *                     unit:
 *                       type: string
 *                       example: KG
 *                     price_per_unit:
 *                       type: number
 *                       example: 15
 *       404:
 *         description: Not found
 */
router.get("/:id", auth, role("ADMIN"), GarbagePricingController.getById);

/**
 * @swagger
 * /garbage-prices/{id}:
 *   put:
 *     summary: Update garbage price
 *     tags: [GarbagePrices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, unit, price_per_unit]
 *             properties:
 *               name:
 *                type: string
 *                example: Plastic
 *               unit:
 *                 type: integer
 *                 example: 1
 *               price_per_unit:
 *                 type: number
 *                 example: 15

 *     responses:
 *       200:
 *         description: Updated successfully
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
 *                   example: Garbage price updated
 */
router.put("/:id", auth, role("ADMIN"), GarbagePricingController.update);

/**
 * @swagger
 * /garbage-prices/{id}:
 *   delete:
 *     summary: Deactivate garbage price
 *     tags: [GarbagePrices]
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
 *         description: Deactivated successfully
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
 *                   example: Garbage price deactivated
 */
router.delete("/:id", auth, role("ADMIN"), GarbagePricingController.deactivate);

module.exports = router;
