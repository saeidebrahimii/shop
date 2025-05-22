const { productTypes, discountTypes } = require("../../common/product.cons");
const {
  Product,
  ProductColor,
  ProductSize,
} = require("../product/product.model");
const { Basket } = require("./basket.model");

async function addProductToBasketHandler(req, res, next) {
  const {
    productId,
    sizeId = undefined,
    colorId = undefined,
    count,
  } = req.body;
  try {
    const product = await Product.findByPk(productId);
    const basketItem = {
      product_id: product?.id,
    };
    if (!product) return res.status(404).json();
    if (product.product_type === productTypes.coloring) {
      const color = await ProductColor.findByPk(colorId);
      if (!color) return res.status(404).json();
      if (count > color.count) return res.status(404).json();
    } else if (product.product_type === productTypes.sizing) {
      const size = await ProductSize.findByPk(sizeId);
      if (!size) return res.status(404).json();
      if (count > size.count) return res.status(404).json();
    } else {
      basketItem["count"] = count;
    }
    await Basket.create(basketItem);
    return res.status(201).json({ msg: "suc" });
  } catch (error) {
    next(error);
  }
}

async function getBasketHandler(req, res, next) {
  const userId = req.user?.id;
  try {
    const basket = await Basket.findAll({
      where: { user_id: userId },
      include: ["product", "color", "size"],
    });
    let productItem = {
      id: 0,
      title: null,
      description: null,
      image: null,
      product_type: null,
      unit: "dollar",
      totalPrice:0,
      finalPrice:0,
      discount:0
    };
    let basketItem = {
      products: [],
      discount: 0,
      totalPrice: 0,
      finalPrice: 0,
    };
    basket.forEach((item) => {
      let isExistProductInList = false;
      basketItem.products.forEach((product) => {
        if (product.id === item?.product_id) {
          isExistProductInList = true;
          if (product.product_type === productTypes.coloring) {
            let colorItem = {
              id: item?.color?.id,
              color_name: item?.color?.color_name,
              color_code: item?.color?.color_code,
              count: item?.count,
              price: item?.color?.price,
            };
            colorItem["totalPrice"] = colorItem["price"] * colorItem["count"];

            if (item?.color?.discount) {
              colorItem["discount"] = item?.color?.discount;
              colorItem["discount_type"] = item?.color?.discount_type;
              if (colorItem["discount_type"] === discountTypes.amount) {
                colorItem["finalPrice"] =
                  colorItem["totalPrice"] - colorItem["discount"];
                if (colorItem["finalPrice"] < 0) colorItem["finalPrice"] = 0;
              } else {
                colorItem["finalPrice"] =
                  colorItem["totalPrice"] -
                  (colorItem["totalPrice"] * colorItem["count"]) / 100;
              }
            }
            product["colors"].push(colorItem);

            product.totalPrice += colorItem["totalPrice"];
            product.finalPrice += colorItem["finalPrice"];
            product.discount += colorItem["discount"];

            basketItem.totalPrice += product.totalPrice;
            basketItem.finalPrice += product.finalPrice;
            basketItem.discount += product.discount;
          }
        }
      });
      if (isExistProductInList === false) {
        productItem.id = item?.product?.id;
        productItem.title = item?.product?.title;
        productItem.description = item?.product?.description;
        productItem.image = item?.product?.image;
        productItem.product_type = item?.product?.product_type;
        if (item?.product?.product_type === productTypes.single) {
          productItem["price"] = item?.product?.price;
          productItem["count"] = item?.count;
          if (item?.product?.discount) {
            productItem["discount_type"] = item?.product?.discount_type;
            productItem["discount"] = item?.product?.discount;
          }
          productItem["totalPrice"] =
            productItem["price"] * productItem["count"];

          if (productItem["discount_type"]) {
            if (productItem["discount_type"] === discountTypes.amount) {
              productItem["finalPrice"] =
                productItem["totalPrice"] - productItem["discount"];
              if (productItem["finalPrice"] < 0) productItem["finalPrice"] = 0;
            }
          }
          productItem["finalPrice"] = productItem["totalPrice"];
        } else if (item?.product?.product_type === productTypes.coloring) {
          let colorItem = {
            id: item?.color?.id,
            color_name: item?.color?.color_name,
            color_code: item?.color?.color_code,
            count: item?.count,
            price: item?.color?.price,
          };

          colorItem["totalPrice"] = colorItem["price"] * colorItem["count"];

          if (item?.color?.discount) {
            colorItem["discount"] = item?.color?.discount;
            colorItem["discount_type"] = item?.color?.discount_type;
            if (colorItem["discount_type"] === discountTypes.amount) {
              colorItem["finalPrice"] =
                colorItem["totalPrice"] - colorItem["discount"];
              if (colorItem["finalPrice"] < 0) colorItem["finalPrice"] = 0;
            } else {
              colorItem["finalPrice"] =
                colorItem["totalPrice"] -
                (colorItem["totalPrice"] * colorItem["count"]) / 100;
            }
          }
          productItem["colors"] = [];
          productItem.colors.push(colorItem);

          productItem.totalPrice += colorItem.totalPrice;
          productItem.finalPrice += colorItem.finalPrice;
          productItem.discount += colorItem.discount;

          if (basketItem.products.length < 1) {
            basketItem.totalPrice += productItem.totalPrice;
            basketItem.finalPrice += productItem.finalPrice;
            basketItem.discount += productItem.discount;
          }
          
        } else if (item?.product_type === productTypes.sizing) {
        }
        basketItem.products.push(productItem);
      }
    });
    res.json(basketItem);
  } catch (error) {
    console.log(error);

    next(error);
  }
}
module.exports = { addProductToBasketHandler, getBasketHandler };
