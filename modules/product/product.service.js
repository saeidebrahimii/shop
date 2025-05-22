const { validationResult } = require("express-validator");
const { productTypes, discountTypes } = require("../../common/product.cons");
const { User } = require("../user/user.model");
const { productMessages } = require("./product.message");
const {
  Product,
  ProductColor,
  ProductSize,
  ProductGallery,
} = require("./product.model");
const fs = require("fs");

async function getProductsHandler(req, res, next) {
  try {
    const products = await Product.findAll({
      order: [["id", "desc"]],
      include: ["sizes", "colors", "gallery"],
    });
    let productList = [];
    if (products.length > 0) {
      products.forEach((item) => {
        let product = {
          id: item.id,
          title: item.title,
          description: item.description,
          imagePath: item.image,
          productType: item.product_type,
        };
        switch (item.product_type) {
          case "single":
            product["price"] = item.price;
            product["count"] = item.count;
            if (item.discount && item.discount_type) {
              product["discount"] = item.discount;
              product["discount_type"] = item.discount_type;
            }
            break;
          case "coloring":
            product["colors"] = [];
            item.colors.forEach((color) => {
              const colorItem = {
                color_name: color.color_name,
                color_code: color.color_code,
                price: color.price,
                count: color.count,
              };
              if (color.discount && color.discount_type) {
                colorItem["discount"] = color.discount;
                colorItem["discount_type"] = color.discount_type;
              }
              product["colors"].push({ ...colorItem });
            });
            break;
          case "sizing":
            product["sizes"] = [];
            item.sizes.forEach((size) => {
              const sizeItem = {
                size: size.size,
                price: size.price,
                count: size.count,
              };
              if (size.discount && size.discount_type) {
                sizeItem["discount"] = size.discount;
                sizeItem["discount_type"] = size.discount_type;
              }
              product["sizes"].push({ ...sizeItem });
            });
            break;
        }
        if (item?.gallery && item?.gallery.length > 0) {
          let galleryList = [];
          item.gallery.forEach((image) => {
            galleryList.push({
              id: image.id,
              path: image.path,
            });
          });
          product["gallery"] = galleryList;
        }
        productList.push(product);
      });
    }
    res.json({ products: productList });
  } catch (error) {
    next(error);
  }
}
async function getProductDetailByIdHandler(req, res, next) {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: { id },
      include: ["sizes", "colors", "gallery"],
    });
    if (!product)
      return res.status(404).json({ msg: productMessages.notFound });
    let detail = {
      id: product.id,
      title: product.title,
      description: product.description,
      imagePath: product.image,
      productType: product.product_type,
    };
    switch (product.product_type) {
      case "single":
        product["price"] = product.price;
        product["count"] = product.count;
        if (product.discount && product.discount_type) {
          detail["discount"] = product.discount;
          detail["discount_type"] = product.discount_type;
        }
        break;
      case "coloring":
        detail["colors"] = [];
        product.colors.forEach((color) => {
          const colorItem = {
            id: color.id,
            color_name: color.color_name,
            color_code: color.color_code,
            price: color.price,
            count: color.count,
          };
          if (color.discount && color.discount_type) {
            colorItem["discount"] = color.discount;
            colorItem["discount_type"] = color.discount_type;
          }
          detail["colors"].push({ ...colorItem });
        });
        break;
      case "sizing":
        detail["sizes"] = [];
        product.sizes.forEach((size) => {
          const sizeItem = {
            id: size.id,
            size: size.size,
            price: size.price,
            count: size.count,
          };
          if (size.discount && size.discount_type) {
            sizeItem["discount"] = size.discount;
            sizeItem["discount_type"] = size.discount_type;
          }
          detail["sizes"].push({ ...sizeItem });
        });
        break;
    }
    if (product?.gallery && product?.gallery.length > 0) {
      let galleryList = [];
      product.gallery.forEach((image) => {
        galleryList.push({
          id: image.id,
          path: image.path,
        });
      });
      detail["gallery"] = galleryList;
    }

    res.json({ ...detail });
  } catch (error) {
    next(error);
  }
}
async function createProductHandler(req, res, next) {
  const { id: userId } = req.user;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, productType } = req.body;
    const { path: imagePath } = req.file;
    const product = await Product.create({
      title,
      description,
      product_type: productType,
      image: imagePath,
      owner_id: userId,
    });
    if (productType === productTypes.single) {
      let { price, count, discount = null, discountType = null } = req.body;
      product.price = price;
      product.count = count;
      if (discount) {
        if (discountType) {
          if (discountType === discountTypes.amount) {
            if (discount > price) discount = price;
            else if (discount < 0) discount = 0;
            product.discount = discount;
            product.discount_type = discountType;
          } else if (discountType === discountTypes.percentage) {
            if (discount > 100) discount = 100;
            else if (discount < 0) discount = 0;
            product.discount = discount;
            product.discount_type = discountType;
          }
        } else {
          if (discount > price) discount = price;
          else if (discount < 0) discount = 0;
          product.discount = discount;
          product.discount_type = discountTypes.amount;
        }
      }
      await product.save();
    } else if (productType === productTypes.coloring) {
      let { colors } = req.body;
      try {
        // console.log(colors);
        console.log(JSON.parse(colors));
        
        colors = JSON.parse(colors);
      } catch (error) {
        return res.status(400).json("structure /colors/ not json format");
      }
      if (colors.length > 0) {
        let colorItems = [];
        colors.forEach((color) => {
          let colorItem = {};
          if (!color.color_name)
            return res.status(400).json({ msg: "/color_name/ not found" });
          else colorItem["color_name"] = color.color_name;
          if (!color.color_code)
            return res.status(400).json({ msg: "/color_code/ not found" });
          else colorItem["color_code"] = color.color_code;
          if (!color.price)
            return res.status(400).json({ msg: "/price/ not found" });
          else colorItem["price"] = color.price;
          if (!color.count)
            return res.status(400).json({ msg: "/count/ not found" });
          else colorItem["count"] = color.count;
          if (color.discount) {
            if (color.discountType === discountTypes.amount) {
              if (color.discount > color.price) color.discount = color.price;
              else if (color.discount < 0) color.discount = 0;
              color.discountType = discountTypes.amount;
            } else if (color.discountType === discountTypes.percentage) {
              if (color.discount > 100) color.discount = 100;
              else if (color.discount < 0) color.discount = 0;
              color.discountType = discountTypes.percentage;
            } else {
              return res
                .status(400)
                .json({ msg: "color /discountType/ not valid" });
            }
          } else {
            if (color.discount > color.price) color.discount = color.price;
            else if (color.discount < 0) color.discount = 0;
            color.discountType = discountTypes.amount;
          }
          colorItem["product_id"] = product.id;
          colorItems.push(colorItem);
        });
        await ProductColor.bulkCreate(colorItems);
        res
          .status(201)
          .json({ msg: "product successfully created.", statusCode: 201 });
      }
    }
    res.status(201).json({ msg: "product successfully created." });
  } catch (error) {
    next(error);
  }
}
async function deleteProductHandler(req, res, next) {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      where: { id },
      include: ["gallery"],
    });
    if (!product)
      return res.status(404).json({ msg: productMessages.notFound });

    if (fs.existsSync(product.image)) fs.unlinkSync(product.image);
    if (product?.gallery && product?.gallery.length > 0) {
      product.gallery.forEach((image) => {
        if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
      });
    }
    await product.destroy();
    return res.status(200).json({ msg: productMessages.delete });
  } catch (error) {
    next(error);
  }
}
async function addGalleryProductHandler(req, res, next) {
  const { id } = req.params;
  const { files: images } = req;
  try {
    const product = await Product.findByPk(id);
    const imageList = [];
    images.forEach((image) => {
      imageList.push({
        product_id: product.id,
        path: image.path,
      });
    });
    await ProductGallery.bulkCreate(imageList);
    res.status(201).json({ msg: productMessages.addGallery });
  } catch (error) {
    next(error);
  }
}
async function deleteGalleryByIdProductHandler(req, res, next) {
  const { id } = req.params;
  try {
    const imageGallery = await ProductGallery.findByPk(id);
    if (!imageGallery)
      return res
        .status(404)
        .json({ msg: productMessages.notFoundImageGallery });

    if (fs.existsSync(imageGallery.path)) fs.unlinkSync(imageGallery.path);
    await imageGallery.destroy();
    res.status(200).json({ msg: productMessages.deleteImageGallery });
  } catch (error) {
    next(error);
  }
}
async function updateProductById(req, res, next) {
  //   TODO update product
}
module.exports = {
  createProductHandler,
  deleteProductHandler,
  getProductsHandler,
  addGalleryProductHandler,
  getProductDetailByIdHandler,
  deleteGalleryByIdProductHandler,
  updateProductById,
};
