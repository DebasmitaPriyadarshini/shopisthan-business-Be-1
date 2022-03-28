const Order = require("../models/order");
const Store = require("../models/store");
const Cart = require("../models/cart");
var CryptoJS = require("crypto-js");
const { CRYPTOJS_KEY } = require("../../config/keys");

exports.editOrder = async (req, res) => {
  try {
    const { _id, orderStatus } = req.body;
    const editOrder = await Order.updateOne(
      { _id: _id },
      { $set: { orderStatus } },
      { new: true, useFindAndModify: false },
      (err, col) => {
        if (err) return res.status(400).json({ err });
        if (col) return res.status(200).json({ col });
      }
    );
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.storeOrders = async (req, res) => {
  let storeDetails = await Store.findOne({ _id: req.store._id });
  if (storeDetails) {
    const ordersData = await Order.find({ storeId: storeDetails._id })
      .populate({ path: "user", select: "_id name" })
      .sort("-createdAt")
      .exec();

    const orders = await CryptoJS.AES.encrypt(
      JSON.stringify(ordersData),
      CRYPTOJS_KEY
    ).toString();
    return res.status(200).json({ orders });
  }
};

// const sendOtp = async (decryptedData, order) => {
//   const { storeId, user } = order;

//   const storeDetails = await Store.findOne({ _id: storeId })
//     .select("storePhoneNo  storeName")
//     .populate({ path: "createdBy", select: "name" })
//     .exec();

//   const userDetails = await User.findOne({ _id: user })
//     .select("name phoneNo")
//     .exec();

//   const storeUserName = storeDetails.createdBy.name;
//   const url = "https://www.shopisthan.com/"
//   const userUrl = "https://www.shopisthan.com/"
//   var stReq = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

//   stReq.headers({
//     "authorization": FAST_2_SMS_AUTH,
//     "Content-Type": "application/json"

//   });

//   stReq.form({
//     "route": FAST_2_SMS_ROT,
//     "sender_id": FAST_2_SMS_SEN_ID,
//     "message": FAST_2_SMS_MSG_VEN_ORD,
//     "variables_values": `${storeUserName}|${storeDetails.storeName}|${order.orderId}|${url}|`,
//     "flash": 0,
//     "numbers": storeDetails.storePhoneNo,

//   });

//   stReq.end(async function (response) {
//     if (response.error) throw new Error(response.error);
//     if (response.body.return) {

//       var userReq = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

//       userReq.headers({
//         "authorization": FAST_2_SMS_AUTH,
//         "Content-Type": "application/json"

//       });

//       userReq.form({
//         "route": FAST_2_SMS_ROT,
//         "sender_id": FAST_2_SMS_SEN_ID,
//         "message": FAST_2_SMS_MSG_USE_ORD,
//         "variables_values": `${userDetails.name}|${storeDetails.storeName}|${order.orderId}|${storeDetails.storePhoneNo}|${userUrl}|`,
//         "flash": 0,
//         "numbers": userDetails.phoneNo,

//       });

//       userReq.end(async function (response) {
//         if (response.error) throw new Error(response.error);
//         console.log(response.body.return);
//       })
//     }
//   });
// }

exports.addOrderCOD = async (req, res) => {
  var bytes = await CryptoJS.AES.decrypt(req.body.payload, CRYPTOJS_KEY);
  var decryptedData = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const {
    totalAmount,
    items,
    paymentStatus,
    paymentType,
    storeId,
    address,
    phoneNo,
    addressName,
    addressState,
    addressCity,
  } = decryptedData.orderData;
  const count = await Order.countDocuments({});
  await Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
    if (result) {
      const order = new Order({
        totalAmount,
        items,
        paymentStatus,
        paymentType,
        storeId,
        address,
        phoneNo,
        user: req.user._id,
        orderId: 101 + count,
        addressName,
        addressState,
        addressCity,
      });

      order.save(async (error, order) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ error });
        }
        if (order) {
          const orderData = await CryptoJS.AES.encrypt(
            JSON.stringify(order),
            CRYPTOJS_KEY
          ).toString();
          res.status(201).json({ orderData });
          // sendOtp(decryptedData.orderData, order)
        }
      });
    }
  });
};
