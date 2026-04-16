const express = require("express");
const router = express.Router();

const auth = require("../../../middlewares/auth.middleware");
const role = require("../../../middlewares/role.middleware");

const GarbabageUnitDataController = require("./garbabageUnitData.controller");

/**
 * @swagger
 * tags:
 *   name: GarbageUnit
 *   description: Garbage unit master data
 */

/**
 * @swagger
 * /master-garbage-unit:
 *   get:
 *     summary: Get all Garbage Unit Data
 *     tags: [GarbageUnit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Garbage Unit Data
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
 *                       sort_order:
 *                         type: integer
 *                         example: 1
 *                       display_name:
 *                         type: string
 *                         example: Kilogram
 *                       short_name:
 *                         type: string
 *                         example: KG
 */
router.get(
  "/",
  auth,
  role("ADMIN", "USER"),
  GarbabageUnitDataController.getGarbabageUnitData,
);
module.exports = router;
