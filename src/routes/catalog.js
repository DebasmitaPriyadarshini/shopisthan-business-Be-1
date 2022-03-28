const express = require("express");
const {
  addCatalog,
  allCatalog,
  editCatalog,
  deleteCatalogById,
  getStoreCatalogDetailsByStoreUrl,
  getStoreCatalogListByStoreId,
  getAllCatalogList,
} = require("../controller/catalog");
const router = express.Router();
const {
  requireSignin,
  storeMiddleware,
} = require("../common-middleware/index");
const {
  validateCatalogRequest,
  isRequestVaildated,
} = require("../validators/validator");

router.post(
  "/create/catalog",
  requireSignin,
  storeMiddleware,
  validateCatalogRequest,
  isRequestVaildated,
  addCatalog
);
router.get("/allcatalog", requireSignin, storeMiddleware, allCatalog);
router.post(
  "/editCatalog",
  requireSignin,
  storeMiddleware,
  validateCatalogRequest,
  isRequestVaildated,
  editCatalog
);
router.delete(
  "/deleteCatalog",
  requireSignin,
  storeMiddleware,
  deleteCatalogById
);
router.get("/storeCatalogDetails/:storeUrl", getStoreCatalogDetailsByStoreUrl);
router.get(
  "/store-catalog-list-by-storeId/:storeId",
  getStoreCatalogListByStoreId
);

router.get("/get-all-catalog-list", getAllCatalogList);

module.exports = router;
