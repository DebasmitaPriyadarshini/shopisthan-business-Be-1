const express = require("express");
const {
  requireSignin,
  storeMiddleware,
  uploadS3,
} = require("../common-middleware");
const router = express.Router();
const {
  createProduct,
  editProduct,
  allProducts,
  outOfStock,
  deleteProductById,
  getProductDetailsById,
  getStoreProductListByStoreId,
  editProductWithPicture,
  getStoreProductDetailsByStoreUrl,
  getAllProductList,
} = require("../controller/product.controller");

router.post(
  "/create/product",
  requireSignin,
  storeMiddleware,
  uploadS3.array("productPictures"),
  createProduct
);

router.post("/edit/product", requireSignin, storeMiddleware, editProduct);
router.post(
  "/edit/productWithPicture",
  requireSignin,
  storeMiddleware,
  uploadS3.array("productPictures"),
  editProductWithPicture
);
router.get("/allproducts", requireSignin, storeMiddleware, allProducts);
router.post("/outOfStockProduct", requireSignin, storeMiddleware, outOfStock);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  storeMiddleware,
  deleteProductById
);
router.get("/storeProductDetails/:storeUrl", getStoreProductDetailsByStoreUrl);
router.get(
  "/store-product-list-by-storeId/:storeId",
  getStoreProductListByStoreId
);
router.get("/productDetailsById/:productId", getProductDetailsById);

router.get("/get-all-product-list", getAllProductList);

module.exports = router;
