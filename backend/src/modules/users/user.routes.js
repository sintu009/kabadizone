const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware.js");
const role = require("../../middlewares/role.middleware.js");
const UserController = require("../users/user.controller.js");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     description: Create a new user with phone number as login username
 *     tags: [Users]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ravi Kumar
 *               email:
 *                 type: string
 *                 example: ravi@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: User@123
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/:id", auth, role("ADMIN"), UserController.update);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: List of users
 */
router.get("/", auth, role("ADMIN"), UserController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", auth, role("ADMIN"), UserController.getById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete user
 *     description: Marks user as deleted (soft delete)
 *     tags: [Users]
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
 *         description: User deleted successfully
 */
router.delete("/:id", auth, role("ADMIN"), UserController.softDelete);

module.exports = router;
