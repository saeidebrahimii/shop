const { Router } = require("express");
const { verifyPayment, paymentHandler } = require("./payment.service");
const { authGuard } = require("../middlewares/auth/auth.guard");

const router = Router();
router.get("/", authGuard, paymentHandler);
router.get("/callback", verifyPayment);
module.exports = { paymentRoutes: router };
