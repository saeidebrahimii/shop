const { Router } = require("express");
const {
  createProductHandler,
  deleteProductHandler,
  getProductsHandler,
  addGalleryProductHandler,
  getProductDetailByIdHandler,
  deleteGalleryByIdProductHandler,
  updateProductById,
} = require("./product.service");
const path = require("path");
const multer = require("multer");
const { createProductValidation } = require("./product.validation");
const { validate } = require("express-validation");
const { authGuard } = require("../middlewares/auth/auth.guard");
const { body, validationResult } = require("express-validator");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/product");
  },
  filename: function (req, file, cb) {
    const extensionFile = path.extname(file.originalname);
    const mimeTypes = [".png", ".jpg", ".webp", ".bitmap"];
    if (mimeTypes.includes(extensionFile)) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    } else
      cb(new Error("Invalid file type, only PNG and JPEG is allowed!"), false);
  },
});
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  authGuard,
  upload.single("image"),
  createProductValidation,
  createProductHandler
);
router.post(
  "/gallery/:id",
  authGuard,
  upload.array("images", 20),
  addGalleryProductHandler
);
router.get("/", getProductsHandler);
router.put("/:id", authGuard, updateProductById);
router.get("/:id", getProductDetailByIdHandler);
router.delete("/:id", authGuard, deleteProductHandler);
router.delete("/gallery/:id", authGuard, deleteGalleryByIdProductHandler);

module.exports = { productRotues: router };
