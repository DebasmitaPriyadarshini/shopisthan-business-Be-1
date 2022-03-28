const { requireSignin, storeMiddleware, requireUserSignin, userMiddleware } = require("../common-middleware");
const { storeOrders, editOrder, addOrderCOD } = require("../controller/order");
const router = require("express").Router();

router.get("/getStoreOrders", requireSignin, storeMiddleware, storeOrders);
router.post("/editOrder", requireSignin, storeMiddleware, editOrder);

router.post('/addOrderCOD', requireUserSignin, userMiddleware, addOrderCOD);


module.exports = router;