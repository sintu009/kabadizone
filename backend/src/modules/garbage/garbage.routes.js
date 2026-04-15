const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const upload = require("../../middlewares/upload.middleware");

const GarbageController = require("./garbage.controller");

/**
 * @swagger
 * tags:
 *   name: GarbageTypes
 *   description: Garbage type management
 */

/**
 * @swagger
 * /garbage-types:
 *   post:
 *     summary: Create garbage type
 *     tags: [GarbageTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Plastic
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post(
  "/",
  auth,
  role("ADMIN"),
  upload.single("image"),
  GarbageController.create,
);

/**
 * @swagger
 * /garbage-types:
 *   get:
 *     summary: Get all garbage types
 *     tags: [GarbageTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of garbage types
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
 *                       name:
 *                         type: string
 *                         example: Plastic
 *                       added_on:
 *                         type: string
 *                         format: date-time
 */
router.get("/", auth, role("ADMIN"), GarbageController.getAll);

/**
 * @swagger
 * /garbage-types/{id}:
 *   get:
 *     summary: Get garbage type by ID
 *     tags: [GarbageTypes]
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
 *         description: Garbage type details
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
 *                     name:
 *                       type: string
 *                       example: Plastic
 *                     added_on:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Not found
 */
router.get("/:id", auth, role("ADMIN"), GarbageController.getById);

/**
 * @swagger
 * /garbage-types/{id}:
 *   put:
 *     summary: Update garbage type
 *     tags: [GarbageTypes]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
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
 *                   example: Garbage type updated
 */
router.put(
  "/:id",
  auth,
  role("ADMIN"),
  upload.single("image"),
  GarbageController.update,
);

/**
 * @swagger
 * /garbage-types/{id}:
 *   delete:
 *     summary: Soft delete garbage type
 *     tags: [GarbageTypes]
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
 *         description: Deleted successfully
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
 *                   example: Garbage type deleted
 */
router.delete("/:id", auth, role("ADMIN"), GarbageController.softDelete);

module.exports = router;
