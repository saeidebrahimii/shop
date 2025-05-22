const { Router } = require("express");
const { getDiscountsHandler, createDiscountHandler } = require("./discount.service");

const router = Router();

router.get("/", getDiscountsHandler);
router.post("/", createDiscountHandler);

module.exports = { discountRoutes: router };
