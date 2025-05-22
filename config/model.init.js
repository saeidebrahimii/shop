const { Basket } = require("../modules/basket/basket.model");
const { Order, OrderItem } = require("../modules/order/order.model");
const { Payment } = require("../modules/payment/payment.model");
const {
  Product,
  ProductColor,
  ProductSize,
  ProductGallery,
} = require("../modules/product/product.model");
const { OtpEmail, User, OtpMobile } = require("../modules/user/user.model");
const { sequelize } = require("./sequelize.config");

OtpEmail.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});
OtpMobile.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

// Product
Product.hasMany(ProductColor, {
  foreignKey: "product_id",
  sourceKey: "id",
  as: "colors",
  onDelete: "Cascade",
});
ProductColor.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});
Product.hasMany(ProductSize, {
  foreignKey: "product_id",
  sourceKey: "id",
  as: "sizes",
  onDelete: "Cascade",
});
ProductSize.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});
Product.hasMany(ProductGallery, {
  foreignKey: "product_id",
  sourceKey: "id",
  as: "gallery",
  onDelete: "Cascade",
});
ProductGallery.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});

//Basket
Basket.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});
Basket.belongsTo(ProductColor, {
  foreignKey: "color_id",
  targetKey: "id",
  as: "color",
});
Basket.belongsTo(ProductSize, {
  foreignKey: "size_id",
  targetKey: "id",
  as: "size",
});

//Order
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  sourceKey: "id",
  as: "orderItems",
});
OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
  targetKey: "id",
  as: "order",
});
OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "id",
  as: "product",
});
OrderItem.belongsTo(ProductColor, {
  foreignKey: "color_id",
  targetKey: "id",
  as: "color",
});

OrderItem.belongsTo(ProductSize, {
  foreignKey: "size_id",
  targetKey: "id",
  as: "size",
});
sequelize.sync({ alter: true });
