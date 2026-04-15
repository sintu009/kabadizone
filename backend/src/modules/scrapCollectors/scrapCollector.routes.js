const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const ScrapCollectors = require("./scrapCollector.controller.js");

/**
 * @swagger
 * tags:
 *   name: ScrapCollectors
 *   description: Scrap collector management
 */

/**
 * @swagger
 * /scrap-collectors:
 *   post:
 *     summary: Create scrap collector
 *     tags: [ScrapCollectors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - password
 *               - blood_group
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh
 *               email:
 *                 type: string
 *                 example: ramesh@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: Collector@123
 *               blood_group:
 *                 type: string
 *                 example: O+
 *               gender:
 *                 type: string
 *                 example: MALE
 *     responses:
 *       201:
 *         description: Scrap collector created successfully
 */

router.post("/", auth, role("ADMIN"), ScrapCollectors.create);

/**
 * @swagger
 * /scrap-collectors/dropdown:
 *   get:
 *     summary: Get scrap collectors dropdown list
 *     description: Returns minimal data for assignment dropdown
 *     tags: [ScrapCollectors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dropdown list
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
 *                         example: Ramesh
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 */
router.get("/dropdown", auth, role("ADMIN"), ScrapCollectors.dropdown);

/**
 * @swagger
 * /scrap-collectors:
 *   get:
 *     summary: Get all scrap collectors
 *     tags: [ScrapCollectors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of Scrap Collectors
 */
router.get("/", auth, role("ADMIN"), ScrapCollectors.getAll);

/**
 * @swagger
 * /scrap-collectors/{id}:
 *   get:
 *     summary: Get scrap collector by ID
 *     tags: [ScrapCollectors]
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
 *         description: Scrap collector details
 */
router.get("/:id", auth, role("ADMIN"), ScrapCollectors.getById);

/**
 * @swagger
 * /scrap-collectors/{id}:
 *   put:
 *     summary: Update scrap collector
 *     tags: [ScrapCollectors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *               email:
 *                 type: string
 *                 example: updated@mail.com
 *               phone:
 *                 type: string
 *                 example: "9999999999"
 *               blood_group:
 *                 type: string
 *                 example: B+
 *               gender:
 *                 type: string
 *                 example: FEMALE
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/:id", auth, role("ADMIN"), ScrapCollectors.update);

/**
 * @swagger
 * /scrap-collectors/{id}:
 *   delete:
 *     summary: Soft delete scrap collector
 *     tags: [ScrapCollectors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", auth, role("ADMIN"), ScrapCollectors.softDelete);

/**
 * @swagger
 * /collector/dashboard:
 *   get:
 *     summary: Scrap Collector dashboard summary
 *     tags: [Collector]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collector dashboard summary
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
 *                     total_assigned_requests:
 *                       type: integer
 *                     pending_requests:
 *                       type: integer
 *                     in_progress_requests:
 *                       type: integer
 *                     completed_requests:
 *                       type: integer
 *                     rejected_requests:
 *                       type: integer
 */
router.get("/dashboard", auth, role("COLLECTOR"), ScrapCollectors.dashboard);

module.exports = router;
