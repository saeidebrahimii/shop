const { Router } = require("express");
const { userRoutes } = require("./user/user.routes");
const { productRotues } = require("./product/product.routes");
const { discountRoutes } = require("./discount/discont.routes");
const { basketRoutes } = require("./basket/basket.routes");
const { authGuard } = require("./middlewares/auth/auth.guard");
const {paymentRoutes} = require("./payment/payment.routes");

const router = Router();

// router.use("/",(req,res,next)=>{res.json("")})
router.use("/user", userRoutes);
router.use("/product", productRotues);
router.use("/payment", paymentRoutes);
router.use("/discount", discountRoutes);
router.use("/basket", basketRoutes);

module.exports = { mainRoutes: router };
