const { Router } = require("express");
const {userRoutes} = require("./user/user.routes");

const router = Router();

router.use("/user", userRoutes);

module.exports = { mainRoutes: router };
