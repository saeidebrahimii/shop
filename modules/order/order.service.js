const { Op } = require("sequelize");
const { Order, OrderItem } = require("./order.model");
const {
  orderTypes,
  productTypes,
  discountTypes,
} = require("../../common/product.cons");
const { Product, ProductColor } = require("../product/product.model");
const { Basket } = require("../basket/basket.model");

async function addOrderItemHandler(req, res, next) {
  const { id: userId } = req.user;
  try {
    const [order, created] = await Order.findOrCreate({
      where: { user_id: userId, [Op.eq]: { status: orderTypes.pending } },
    });
    let orderItemList = [];
    const basket = await Basket.findAll({});
    basket.products.forEach((product) => {
      if (product.product_type === productTypes.coloring) {
        product.colors.forEach(async (color) => {
          let colorItem = {};
          const productColor = await ProductColor.findByPk(color?.id);
          if (productColor) {
            if (color.count > productColor.count) {
              res.status(500).json({ msg: "count color" });
            }
          }
          colorItem["id"] = productColor?.id;
          colorItem["color_name"] = productColor?.color_name;
          colorItem["color_code"] = productColor?.color_code;
          colorItem["count"] = color?.count;
          colorItem["price"] = productColor?.price;
          colorItem["totalPrice"] = colorItem["count"] * colorItem["price"];
          if (productColor.discount) {
            colorItem["discount"] = productColor.discount;
            colorItem["discount_type"] = productColor.discount_type;
            if (productColor.discount_type == discountTypes.amount) {
              colorItem["finalPrice"] =
                colorItem["totalPrice"] - colorItem["discount"];
              if (colorItem["finalPrice"] < 0) colorItem["finalPrice"] = 0;
            } else {
              colorItem["finalPrice"] =
                colorItem["totalPrice"] -
                (colorItem["totalPrice"] * colorItem["discount"]) / 100;
            }
          } else {
            colorItem["finalPrice"] = colorItem["totalPrice"];
          }
          orderItemList.push({
            order_id: order.id,
            product_id: product.id,
            color_id: colorItem["id"],
            count: colorItem["count"],
          });
        });
      }
    });
    await OrderItem.bulkCreate(orderItemList);
  } catch (error) {
    next(error);
  }
}
module.exports = { addOrderItemHandler };
