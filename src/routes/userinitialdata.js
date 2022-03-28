const express = require("express");
const {
  requireSignin,
  storeMiddleware,
  requireUserSignin,
  userMiddleware,
} = require("../common-middleware");
const {
  userStoreData,
  userData,
  userInitialData,
  editAddress,
  sampleStores,
  sampleProducts,
  sampleCatalogs,
  userInitialDataByStoreId,
  getUserAllOrders,
  getUserDetails,
  editUserAddress,
  editUserProfile,
} = require("../controller/userinitialdata");
const router = express.Router();

router.get("/userStoreData", requireSignin, storeMiddleware, userStoreData);
router.get("/userData", userData);
router.post("/editAddress", requireUserSignin, userMiddleware, editAddress);
router.get(
  "/userInitialData",
  requireUserSignin,
  userMiddleware,
  userInitialData
);
router.get(
  "/user-order-data-by-storeId/:storeId",
  requireUserSignin,
  userMiddleware,
  userInitialDataByStoreId
);

router.get(
  "/get-user-details",
  requireUserSignin,
  userMiddleware,
  getUserDetails
);

router.get(
  "/get-user-all-orders",
  requireUserSignin,
  userMiddleware,
  getUserAllOrders
);

router.post(
  "/edit-user-address",
  requireUserSignin,
  userMiddleware,
  editUserAddress
);

router.post(
  "/edit-user-profile",
  requireUserSignin,
  userMiddleware,
  editUserProfile
);

//sample Store Data

router.get("/sample-stores", sampleStores);
router.get("/sample-products", sampleProducts);
router.get("/sample-catalogs", sampleCatalogs);

module.exports = router;
