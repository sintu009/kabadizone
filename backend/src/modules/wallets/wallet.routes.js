const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const Controller = require("./wallet.controller");

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management (Admin)
 */

/**
 * @swagger
 * /wallets/credit:
 *   post:
 *     summary: Credit wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [owner_type, owner_id, amount]
 *             properties:
 *               owner_type:
 *                 type: string
 *                 enum: [COLLECTOR, USER]
 *               owner_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 example: 500
 *               remarks:
 *                 type: string
 *                 example: Initial top-up
 *     responses:
 *       200:
 *         description: Wallet credited successfully
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
 *                   example: Wallet credited
 *       400:
 *         description: Validation error
 */
router.post("/credit", auth, role("ADMIN"), Controller.credit);

/**
 * @swagger
 * /wallets/debit:
 *   post:
 *     summary: Debit wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [owner_type, owner_id, amount]
 *             properties:
 *               owner_type:
 *                 type: string
 *                 enum: [COLLECTOR, USER]
 *               owner_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 example: 200
 *               remarks:
 *                 type: string
 *                 example: Pickup deduction
 *     responses:
 *       200:
 *         description: Wallet debited successfully
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
 *                   example: Wallet debited
 *       400:
 *         description: Insufficient balance
 */
router.post("/debit", auth, role("ADMIN"), Controller.debit);

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get wallet details
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: owner_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [COLLECTOR, USER]
 *       - in: query
 *         name: owner_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wallet details
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
 *                     owner_type:
 *                       type: string
 *                       example: COLLECTOR
 *                     owner_id:
 *                       type: integer
 *                       example: 10
 *                     balance:
 *                       type: number
 *                       example: 1500.50
 *                     created_on:
 *                       type: string
 *                       format: date-time
 */
router.get("/", auth, role("ADMIN"), Controller.get);

/**
 * @swagger
 * /wallets/transactions:
 *   get:
 *     summary: Get wallet transaction history
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: owner_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [COLLECTOR, USER]
 *       - in: query
 *         name: owner_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wallet transactions
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
 *                         example: 101
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       transaction_type:
 *                         type: string
 *                         example: CREDIT
 *                       remarks:
 *                         type: string
 *                         example: Initial top-up
 *                       created_on:
 *                         type: string
 *                         format: date-time
 */
router.get("/transactions", auth, role("ADMIN"), Controller.transactions);

module.exports = router;
