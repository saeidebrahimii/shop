const { discountMessages } = require("./discount.message");
const { Discount } = require("./discount.model");

async function createDiscountHandler(req, res, next) {
  const { title, description, code, limit, discount, discountType } = req.body;
  try {
    const [newDiscount, created] = await Discount.findOrCreate({
      where: { code },
      defaults: {
        title,
        description,
        limit,
        discount,
        discount_type: discountType,
      },
    });
    if (!created)
      return res.status(402).json({ msg: discountMessages.codeExists });
    return res.status(201).json({ msg: discountMessages.create });
  } catch (error) {
    next(error);
  }
}

async function getDiscountsHandler(req, res, next) {
  try {
    const discounts = await Discount.findAll({});
    return res.json(discounts);
  } catch (error) {
    next(error);
  }
}
module.exports = { createDiscountHandler, getDiscountsHandler };
