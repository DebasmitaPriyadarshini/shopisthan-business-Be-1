const express = require("express");
const {
  signout,
  signin,
  verifiy,
  storeSigninOtp,
  userSignin,
  userOtpVerifiy,
} = require("../controller/auth");
const {
  validateSigninRequest,
  isRequestVaildated,
  validateVerifiySigninRequest,
} = require("../validators/validator");
const router = express.Router();

router.post("/signout", signout);
router.post("/signin", validateSigninRequest, isRequestVaildated, signin);
router.post(
  "/verifiy",
  validateVerifiySigninRequest,
  isRequestVaildated,
  verifiy
);
router.post(
  "/signin-store-otp",
  validateSigninRequest,
  isRequestVaildated,
  storeSigninOtp
);

router.post(
  "/user-signin",
  validateSigninRequest,
  isRequestVaildated,
  userSignin
);
router.post(
  "/user-otp-verifiy",
  validateVerifiySigninRequest,
  isRequestVaildated,
  userOtpVerifiy
);

module.exports = router;
