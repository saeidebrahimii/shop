const { Joi } = require("express-validation");
const { productTypes, discountTypes } = require("../../common/product.cons");
const { checkSchema, body } = require("express-validator");

// const createProductValidation = {
//   body: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     productType: Joi.string()
//       .valid(...Object.values(productTypes))
//       .required(),
//     image: Joi.required(),
//     discount: Joi.number().min(0).optional(),
//     discountType: Joi.valid(...Object.values(discountTypes)).optional(),
//     price: Joi.number()
//       .min(0)
//       .when("productType", {
//         is: productTypes.single,
//         then: Joi.required(),
//       })
//       .optional(),
//     count: Joi.number()
//       .min(0)
//       .when("productType", {
//         is: productTypes.single,
//         then: Joi.required(),
//       })
//       .optional(),
//     colors: Joi.string().when("productType", {
//       is: productTypes.coloring,
//       then: Joi.required(),
//     }),
//   }),
// };

const createProductValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("productType")
    .notEmpty()
    .withMessage("productType is required")
    .isIn(Object.values(productTypes)),
  body("count").custom((value, { req }) => {
    if (
      req.body.productType === productTypes.single &&
      (value === undefined || value === null)
    )
      throw new Error("Count is required");
    if (req.body.productType === productTypes.single && isNaN(value))
      throw new Error("Count should was number");
    return true;
  }),
  body("price").custom((value, { req }) => {
    if (
      req.body.productType === productTypes.single &&
      (value === undefined || value === null)
    )
      throw new Error("Price is required");
    if (req.body.productType === productTypes.single && isNaN(value))
      throw new Error("Price should was number");
    return true;
  }),
  body("discount").custom((value, { req }) => {
    if (req.body.productType === productTypes.single && value  && isNaN(value))
      throw new Error("Discount should was number");
    return true;
  }),
  body("discountType").custom((value, { req }) => {
    if (req.body.productType === productTypes.single && value && !Object.values(discountTypes).includes(value))
      throw new Error(`Discount type not valid ${Object.values(discountTypes).toString()}`);
    return true;
  }),
  body("colors").custom((value, { req }) => {
    if (
      req.body.productType === productTypes.coloring &&
      (value === undefined || value === null)
    )
      throw new Error("Colors is required");
    return true;
  }),
];

module.exports = { createProductValidation };
