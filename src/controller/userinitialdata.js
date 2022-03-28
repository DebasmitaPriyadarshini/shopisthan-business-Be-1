const Store = require("../models/store");
const Order = require("../models/order");
var CryptoJS = require("crypto-js");
const StorePlan = require("../models/store.plan");
const User = require("../models/auth");
const { CRYPTOJS_KEY } = require("../../config/keys");

const SampleStore = require("../models/sample.store");
const SampleProduct = require("../models/sample.product");
const SampleCatalog = require("../models/sample.catalog");

exports.userData = async (req, res) => {
  const storePlansData = await StorePlan.find({}).exec();
  console.log("StorePlans", storePlansData);
  const storePlans = await CryptoJS.AES.encrypt(
    JSON.stringify(storePlansData),
    CRYPTOJS_KEY
  ).toString();
  res.status(200).json({
    storePlans,
  });
};

exports.userStoreData = async (req, res) => {
  try {
    let storeDetails = await Store.findOne({ _id: req.store._id });

    if (storeDetails) {
      const storeData = await Store.findOne({ _id: storeDetails._id })
        .select(
          "-storeCatalogs -createdBy -createdAt  -updatedAt -__v  -orderCreationId  -razorpayOrderId -otpVerified -razorpayPaymentId -amount "
        )
        // .populate({ path: "followers", select: "name picture" })
        .exec();
      const store = await CryptoJS.AES.encrypt(
        JSON.stringify(storeData),
        CRYPTOJS_KEY
      ).toString();

      return res.status(200).json({
        store,
      });
    } else {
      return res.status(401).json({
        message: "Account does not exist",
      });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.userInitialData = async (req, res) => {
  try {
    let userDetails = await User.findOne({ _id: req.user._id });

    if (userDetails) {
      const userData = await User.findOne({ _id: userDetails._id })
        .select(
          "_id  name addressName addressMobileNumber addressAddress phoneNo addressState addressCity"
        )
        .exec();

      const OrderData = await Order.find({ user: req.user._id })
        .select(
          "_id paymentStatus paymentType  items totalAmount orderId address createdAt orderStatus storeId phoneNo addressState addressCity addressName"
        )
        // .populate("items.productId", "_id productName productPictures")
        .populate("storeId", "storeName storePhoneNo storeAddress")
        .sort("-createdAt")
        .exec();

      const user = await CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        CRYPTOJS_KEY
      ).toString();
      const order = await CryptoJS.AES.encrypt(
        JSON.stringify(OrderData),
        CRYPTOJS_KEY
      ).toString();
      return res.status(200).json({
        user,
        order,
      });
    } else {
      return res.status(401).json({
        message: "Account does not exist",
      });
    }
  } catch (error) {
    console.clear();
    return res.status(400).json({ error });
  }
};

exports.getUserAllOrders = async (req, res) => {
  try {
    const OrderData = await Order.find({ user: req.user._id })
      .select(
        "_id paymentStatus paymentType  items totalAmount orderId address createdAt orderStatus storeId phoneNo addressState addressCity addressName"
      )
      // .populate("items.productId", "_id productName productPictures")
      .populate("storeId", "storeName storePhoneNo storeAddress")
      .sort("-createdAt")
      .exec((err, order) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Error while getting order data" });
        } else if (order) {
          return res.status(200).json({
            order,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Error while getting order data" });
        }
      });
  } catch (error) {
    console.clear();
    return res.status(400).json({ error });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    await User.findOne({ _id: req.user._id })
      .select("-createdAt  -updatedAt -__v -createdBy -role -otp -verified")
      .exec((err, user) => {
        if (err) {
          return res.status(400).json({ message: "No such user exists" });
        } else if (user) {
          return res.status(200).json({
            user,
          });
        } else {
          return res.status(400).json({ message: "No such user exists" });
        }
      });
  } catch (error) {
    console.clear();
    return res.status(400).json({ error });
  }
};

exports.userInitialDataByStoreId = async (req, res) => {
  try {
    const { storeId } = req.params;
    if (storeId) {
      let userDetails = await User.findOne({ _id: req.user._id });
      if (userDetails) {
        const userData = await User.findOne({ _id: userDetails._id })
          .select(
            "_id  name addressName addressMobileNumber addressAddress phoneNo addressState addressCity"
          )
          .exec();

        const OrderData = await Order.find({
          user: req.user._id,
          storeId: storeId,
        })
          .select(
            "_id paymentStatus paymentType  items totalAmount orderId address createdAt orderStatus storeId phoneNo addressState addressCity addressName"
          )
          // .populate("items.productId", "_id productName productPictures")
          .populate("storeId", "storeName storePhoneNo storeAddress")
          .sort("-createdAt")
          .exec();
        console.log("Order:", OrderData);
        return res.status(200).json({
          user: userData,
          order: OrderData,
        });
      } else {
        return res.status(401).json({
          message: "Account does not exist",
        });
      }
    } else {
      return res.status(400).json({ message: "Params required" });
    }
  } catch (error) {
    console.clear();
    return res.status(400).json({ error });
  }
};

exports.editAddress = async (req, res) => {
  const {
    addressName,
    addressMobileNumber,
    addressAddress,
    name,
    addressState,
    addressCity,
  } = req.body;

  const updatedUserProfile = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        addressName,
        addressMobileNumber,
        addressAddress,
        name,
        addressState,
        addressCity,
      },
    },
    { new: true, useFindAndModify: false },
    async (err, updatedUserInfo) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (updatedUserInfo) {
        const {
          addressName,
          addressMobileNumber,
          addressAddress,
          name,
          _id,
          phoneNo,
          addressState,
          addressCity,
        } = updatedUserInfo;
        const userDetails = {
          addressName,
          addressMobileNumber,
          addressAddress,
          name,
          _id,
          phoneNo,
          addressState,
          addressCity,
        };
        const userUpdatedDetails = await CryptoJS.AES.encrypt(
          JSON.stringify(userDetails),
          CRYPTOJS_KEY
        ).toString();
        return res.status(200).json({ userUpdatedDetails });
      }
    }
  );
};

exports.editUserAddress = async (req, res) => {
  const {
    addressName,
    addressMobileNumber,
    addressAddress,
    addressPinCode,
    addressState,
    addressCity,
    addressNearbyLocation,
    addressHouseName,
    addressAreaName,
  } = req.body;

  const updatedUserProfile = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        addressName,
        addressMobileNumber,
        addressAddress,
        addressPinCode,
        addressState,
        addressCity,
        addressNearbyLocation,
        addressHouseName,
        addressAreaName,
      },
    },
    { new: true, useFindAndModify: false },
    async (err, updatedUserInfo) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (updatedUserInfo) {
        const {
          name,
          _id,
          phoneNo,
          addressName,
          addressMobileNumber,
          addressAddress,
          addressPinCode,
          addressState,
          addressCity,
          addressNearbyLocation,
          loginId,
          addressHouseName,
          addressAreaName,
        } = updatedUserInfo;
        const userDetails = {
          name,
          _id,
          phoneNo,
          addressName,
          addressMobileNumber,
          addressAddress,
          addressPinCode,
          addressState,
          addressCity,
          addressNearbyLocation,
          loginId,
          addressHouseName,
          addressAreaName,
        };
        return res.status(200).json({ userDetails });
      }
    }
  );
};

exports.editUserProfile = async (req, res) => {
  const {
    addressName,
    addressMobileNumber,
    addressAddress,
    addressPinCode,
    addressState,
    addressCity,
    addressNearbyLocation,
    addressHouseName,
    addressAreaName,
    name,
    phoneNo,
  } = req.body;

  const updatedUserProfile = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        addressName,
        addressMobileNumber,
        addressAddress,
        addressPinCode,
        addressState,
        addressCity,
        addressNearbyLocation,
        addressHouseName,
        addressAreaName,
        name,
        phoneNo,
      },
    },
    { new: true, useFindAndModify: false },
    async (err, updatedUserInfo) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (updatedUserInfo) {
        const {
          name,
          _id,
          phoneNo,
          addressName,
          addressMobileNumber,
          addressAddress,
          addressPinCode,
          addressState,
          addressCity,
          addressNearbyLocation,
          loginId,
          addressHouseName,
          addressAreaName,
        } = updatedUserInfo;
        const userDetails = {
          name,
          _id,
          phoneNo,
          addressName,
          addressMobileNumber,
          addressAddress,
          addressPinCode,
          addressState,
          addressCity,
          addressNearbyLocation,
          loginId,
          addressHouseName,
          addressAreaName,
        };
        return res.status(200).json({ userDetails });
      }
    }
  );
};

exports.sampleStores = async (req, res) => {
  await SampleStore.find({})
    .sort("-createdAt")
    .exec(async (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      if (result) {
        const store = await CryptoJS.AES.encrypt(
          JSON.stringify(result),
          CRYPTOJS_KEY
        ).toString();
        return res.status(200).json({ store });
      }
    });
};

exports.sampleProducts = async (req, res) => {
  await SampleProduct.find({})
    .sort("-createdAt")
    .exec(async (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      if (result) {
        const product = await CryptoJS.AES.encrypt(
          JSON.stringify(result),
          CRYPTOJS_KEY
        ).toString();
        return res.status(200).json({ product });
      }
    });
};

exports.sampleCatalogs = async (req, res) => {
  await SampleCatalog.find({})
    .sort("-createdAt")
    .exec(async (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      if (result) {
        const catalog = await CryptoJS.AES.encrypt(
          JSON.stringify(result),
          CRYPTOJS_KEY
        ).toString();
        return res.status(200).json({ catalog });
      }
    });
};
