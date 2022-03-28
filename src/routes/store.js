const express = require("express");
const {
  storeMiddleware,
  requireSignin,
  uploadS3,
} = require("../common-middleware");
const router = express.Router();

const {
  uploadProfilePic,
  editStore,
  verifiyStoreOtp,
  createReNewPlanOrderId,
  suceessReNewPlanPayment,
  getStoreDetailsByStoreUrl,
  createFreeOnlineStoreOtp,
  createFreeOnlineStoreOtpVerify,
  getStoreDetailsByStoreId,
  demoStore,
  getAllStoreList,
  addStoreTags
} = require("../controller/store");
const {
  validateCreateFreeOnlineStoreRequest,
  isRequestVaildated,
} = require("../validators/validator");

router.post(
  "/store/profilepic",
  requireSignin,
  storeMiddleware,
  uploadS3.single("storeProfilePicture"),
  uploadProfilePic
);
router.post("/edit/store", requireSignin, storeMiddleware, editStore);
router.post("/verfiy-store-otp", verifiyStoreOtp);
router.post(
  "/re-new-store-plan-orderid",
  requireSignin,
  storeMiddleware,
  createReNewPlanOrderId
);
router.post(
  "/success-re-new-store-payment",
  requireSignin,
  storeMiddleware,
  suceessReNewPlanPayment
);
router.get("/storeDetails/:storeUrl", getStoreDetailsByStoreUrl);

router.get("/store-details-by-storeId/:storeId", getStoreDetailsByStoreId);

router.post(
  "/create-free-online-store-otp",
  validateCreateFreeOnlineStoreRequest,
  isRequestVaildated,
  createFreeOnlineStoreOtp
);
router.post(
  "/create-free-online-store-otp-verify",
  createFreeOnlineStoreOtpVerify
);

router.post("/demo-store", demoStore);

router.get("/get-all-store-list", getAllStoreList);



router.post("/add-store-tags", addStoreTags);

module.exports = router;
