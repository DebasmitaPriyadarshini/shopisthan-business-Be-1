const express = require("express");
const { requireUserSignin, userMiddleware } = require("../common-middleware");
const router = express.Router();
const { addItemToCart, getCartItems, removeCartItems } = require("../controller/cart");


router.post("/user/cart/addtocart", requireUserSignin, userMiddleware, addItemToCart);
router.post("/user/getCartItems", requireUserSignin, userMiddleware, getCartItems);
router.post(
    "/user/cart/removeItem",
    requireUserSignin,
    userMiddleware,
    removeCartItems
);

module.exports = router;
