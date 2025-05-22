const { Router } = require("express");
const {
  getBasketHandler,
  addProductToBasketHandler,
} = require("./basket.service");
const { authGuard } = require("../middlewares/auth/auth.guard");

const router = Router();

router.get("/", authGuard, getBasketHandler);
router.post("/", authGuard, addProductToBasketHandler);

module.exports = { basketRoutes: router };
