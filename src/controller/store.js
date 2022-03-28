const Store = require("../models/store");
const Razorpay = require("razorpay");
const uniuId = require("uniqid");
const crypto = require("crypto");
const { KEY_ID, SECREAT_KEY } = require("../../config/keys");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, CRYPTOJS_KEY } = require("../../config/keys");
const { AppSync } = require("aws-sdk");
var CryptoJS = require("crypto-js");
const { generateOTP } = require("../common-middleware");
var unirest = require("unirest");
const {
  FAST_2_SMS_AUTH,
  FAST_2_SMS_ROT,
  FAST_2_SMS_SEN_ID,
  FAST_2_SMS_MSG_OTP,
} = require("../../config/keys");

var instance = new Razorpay({
  key_id: KEY_ID,
  key_secret: SECREAT_KEY,
});

exports.editStore = async (req, res) => {
  const {
    storeName,
    storeAddress,
    storeDescription,
    storeState,
    storeCity,
    storeSince,
    storeEmail,
    storeFacebookUrl,
    storeInstagramUrl,
  } = req.body;

  const updatedStoreProfile = await Store.findOneAndUpdate(
    { _id: req.store._id },
    {
      $set: {
        storeName,
        storeAddress,
        storeDescription,
        storeState,
        storeCity,
        storeSince,
        storeEmail,
        storeFacebookUrl,
        storeInstagramUrl,
      },
    },
    { new: true, useFindAndModify: false },
    async (err, updatedStoreInfo) => {
      if (err) {
        return res.status(400).json({ err });
      }
      if (updatedStoreInfo) {
        const {
          _id,
          storeName,
          storeType,
          storeUrl,
          storeProfilePicture,
          storeCategory,
          storeState,
          storeStartedDate,
          storeReNewPlanDate,
          storeCity,
          storePlanType,
          storePhoneNumber,
          storeEmail,
          storeAddress,
          storeDescription,
          storePinCode,
          paymentType,
          storeSince,
          storeVerified,
          storeFacebookUrl,
          storeInstagramUrl,
          productFeature,
          catalogFeature,
          orderFeature,
          customerFeature,
        } = updatedStoreInfo;

        const storeData = {
          _id,
          storeName,
          storeType,
          storeUrl,
          storeProfilePicture,
          storeCategory,
          storeState,
          storeStartedDate,
          storeReNewPlanDate,
          storeCity,
          storePlanType,
          storePhoneNumber,
          storeEmail,
          storeAddress,
          storeDescription,
          storePinCode,
          paymentType,
          storeSince,
          storeVerified,
          storeFacebookUrl,
          storeInstagramUrl,
          productFeature,
          catalogFeature,
          orderFeature,
          customerFeature,
        };
        const storeInfo = await CryptoJS.AES.encrypt(
          JSON.stringify(storeData),
          CRYPTOJS_KEY
        ).toString();
        return res.status(201).json({ storeInfo });
      }
    }
  );
};

exports.uploadProfilePic = async (req, res) => {
  let storeProfilePicture = null;
  if (req.file) {
    storeProfilePicture = { img: req.file.location };
  }

  const updatedStoreProfile = await Store.findOneAndUpdate(
    { _id: req.store._id },
    { $set: { storeProfilePicture } },
    { new: true, useFindAndModify: false },
    async (err, updatedStoreInfo) => {
      if (err) {
        return res.status(400).json({ err });
      }
      if (updatedStoreInfo) {
        const {
          _id,
          storeName,
          storeType,
          storeUrl,
          storeProfilePicture,
          storeCategory,
          storeState,
          storeStartedDate,
          storeReNewPlanDate,
          storeCity,
          storePlanType,
          storePhoneNumber,
          storeEmail,
          storeAddress,
          storeDescription,
          storePinCode,
          paymentType,
          storeSince,
          storeVerified,
          storeFacebookUrl,
          storeInstagramUrl,
          productFeature,
          catalogFeature,
          orderFeature,
          customerFeature,
        } = updatedStoreInfo;

        const storeData = {
          _id,
          storeName,
          storeType,
          storeUrl,
          storeProfilePicture,
          storeCategory,
          storeState,
          storeStartedDate,
          storeReNewPlanDate,
          storeCity,
          storePlanType,
          storePhoneNumber,
          storeEmail,
          storeAddress,
          storeDescription,
          storePinCode,
          paymentType,
          storeSince,
          storeVerified,
          storeFacebookUrl,
          storeInstagramUrl,
          productFeature,
          catalogFeature,
          orderFeature,
          customerFeature,
        };
        const storeInfo = await CryptoJS.AES.encrypt(
          JSON.stringify(storeData),
          CRYPTOJS_KEY
        ).toString();
        return res.status(201).json({ storeInfo });
      }
    }
  );
};

exports.verifiyStoreOtp = async (req, res) => {
  try {
    const {
      loginId,
      storeName,
      storeType,
      storeCategory,
      storePhoneNumber,
      storePlan,
      otp,
    } = req.body;

    await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
      async (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "something went wrong please try again",
          });
        }

        if (result) {
          return res.status(401).json({
            message: "Your Store already exists",
          });
        } else {
          await Store.findOne({ storePhoneNumber: loginId }).exec(
            async (error, store) => {
              if (error) {
                return res.status(401).json({
                  message: "something went wrong please try again",
                });
              }
              if (store) {
                if (store.otp === otp) {
                  const storeUrlWithoutSpecailCharacters = storeName
                    .toLowerCase()
                    .replace(/[&\/\\#,+()$~%.₹'":*?|=-_<>{}@!^_]/g, "")
                    .trim();
                  let storeUrl = storeUrlWithoutSpecailCharacters
                    .split(" ")
                    .join("-");
                  const ckeckAlreadyStoreNameExists = await Store.find({
                    storeUrl: storeUrl,
                  }).countDocuments();

                  if (ckeckAlreadyStoreNameExists > 0) {
                    storeUrl = storeUrl + ckeckAlreadyStoreNameExists;
                  } else {
                    storeUrl = storeUrl;
                  }
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = mm + "/" + dd + "/" + yyyy;

                  (store.storeName = storeName),
                    (store.storeType = storeType),
                    (store.storeCategory = storeCategory),
                    (store.storePhoneNumber = storePhoneNumber),
                    (store.storePlan = storePlan),
                    (store.storeStartedDate = today),
                    (store.storePlanType = "Free"),
                    (store.storeUrl = storeUrl.split(" ").join("-")),
                    (store.storeVerified = false),
                    (store.showInMarketPlace = true),
                    (store.otp = ""),
                    (store.otpVerified = true),
                    (store.role = "store");

                  store.save(async (error, result) => {
                    if (error) {
                      return res.status(401).json({
                        message: "something went wrong please try again",
                      });
                    } else {
                      const token1 = jwt.sign(
                        { _id: result._id, role: result.role },
                        JWT_SECRET
                      );
                      res.cookie("token", token1);
                      const token = await CryptoJS.AES.encrypt(
                        JSON.stringify(token1),
                        CRYPTOJS_KEY
                      ).toString();
                      return res.status(200).json({
                        token,
                      });
                    }
                  });
                } else {
                  return res.status(401).json({
                    message: "Invalid OTP",
                  });
                }
              } else {
                return res.status(401).json({
                  message: "try to register first",
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.createReNewPlanOrderId = async (req, res) => {
  let store = await Store.findOne({ _id: req.store._id });

  if (!store) {
    return res.status(400).json({ message: "Store doesn't Exists" });
  }

  var options = {
    amount: req.body.toatalPrice * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: uniuId(),
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Try Again Later",
      });
    }
    orderId = order.id;
    return res.status(200).json(order);
  });
};

exports.suceessReNewPlanPayment = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      storeVerified,
      storePlan,
    } = req.body;

    let store = await Store.findOne({ _id: req.store._id });
    if (!store) {
      return res.status(400).json({ message: "Store doesn't Exists" });
    }

    const hash = crypto
      .createHmac("sha256", SECREAT_KEY)
      .update(orderCreationId + "|" + razorpayPaymentId)
      .digest("hex");

    if (razorpaySignature === hash) {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }
      today = mm + "/" + dd + "/" + yyyy;

      (store.storeReNewPlanDate = today),
        (store.razorpayOrderId = razorpayOrderId),
        (store.orderCreationId = orderCreationId),
        (store.razorpayPaymentId = razorpayPaymentId),
        (store.amount = amount / 100),
        (store.storePlanType = "Paid"),
        (store.storePlan = storePlan),
        (store.storeVerified = storeVerified);
      store.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "something went wrong please try again" });
        } else {
          return res.status(200).json({ message: "Success" });
        }
      });
    } else {
      return res.status(400).json({ message: "Transactions not legit" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Try Again Later" });
  }
};

exports.getStoreDetailsByStoreId = async (req, res) => {
  console.log("requested");
  const { storeId } = req.params;
  if (storeId) {
    await Store.findOne({ _id: storeId })
      .select(
        "_id createdAt storeName storeUrl storeProfilePicture storeCategory storeState storeCity  storeAddress storeDescription storePinCode storeSince"
      )
      .exec(async (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Store doesn't exists" });
        }
        if (result) {
          return res.status(200).json({ store: result });
        } else {
          return res.status(400).json({ message: "Store doesn't exists" });
        }
      });
  } else {
    return res.status(400).json({ message: "Params required" });
  }
};

exports.getStoreDetailsByStoreUrl = async (req, res) => {
  const { storeUrl } = req.params;
  if (storeUrl) {
    await Store.findOne({ storeUrl: storeUrl })
      .select(
        "_id createdAt storeName storeUrl storeProfilePicture storeCategory storeState storeCity  storeAddress storeDescription storePinCode storeSince"
      )
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
        } else {
          return res.status(400).json({ message: "Store doesn't exists" });
        }
      });
  } else {
    return res.status(400).json({ message: "Params required" });
  }
};

exports.createFreeOnlineStoreOtp = async (req, res) => {
  const { loginId, storeName, storeCategory, storePlan, storeType } = req.body;
  await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
    async (error, store) => {
      if (store) {
        return res.status(401).json({
          message: "Your Store already exists",
        });
      }

      const otp = await generateOTP(6);
      console.log(otp);
      var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

      req.headers({
        authorization: FAST_2_SMS_AUTH,
        "Content-Type": "application/json",
      });

      req.form({
        route: FAST_2_SMS_ROT,
        sender_id: FAST_2_SMS_SEN_ID,
        message: FAST_2_SMS_MSG_OTP,
        variables_values: otp,
        flash: 0,
        numbers: loginId,
      });

      req.end(async function (response) {
        if (response.error) {
          return res.status(401).json({
            message: response.error,
          });
        }
        if (response.body.return) {
          const checkforalreadyOtp = await Store.findOne({
            storePhoneNumber: loginId,
          }).exec();

          if (checkforalreadyOtp) {
            const updatedUserOtp = await Store.findOneAndUpdate(
              { storePhoneNumber: loginId },
              {
                $set: {
                  otp: otp,
                },
              },
              { new: true, useFindAndModify: false },
              (err, data) => {
                if (err) {
                  return res.status(400).json({ err });
                } else {
                  // const { _id, loginId } = data;
                  return res.status(200).json({
                    message: "Otp Sent successfully",
                  });
                }
              }
            );
          } else {
            const _store = new Store({
              role: "store",
              otp: otp,
              otpVerified: false,
              storePhoneNumber: loginId,
              storeVerified: false,
              storePlanType: "Free",
              storeName,
              storeCategory,
              storePlan,
              storeType,
              showInMarketPlace: true,
            });
            _store.save((error, data) => {
              if (error) {
                return res.status(401).json({
                  error: error,
                });
              } else {
                return res.status(200).json({
                  message: "Otp Sent successfully",
                });
              }
            });
          }
        } else {
          return res.status(401).json({
            message: "Something went wrong!!!",
          });
        }
      });
    }
  );
};

exports.createFreeOnlineStoreOtpVerify = async (req, res) => {
  try {
    const { loginId, otp } = req.body;

    await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
      async (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "something went wrong please try again",
          });
        }

        if (result) {
          return res.status(401).json({
            message: "Your Store already exists",
          });
        } else {
          await Store.findOne({
            storePhoneNumber: loginId,
            otpVerified: false,
          }).exec(async (error, store) => {
            if (error) {
              return res.status(401).json({
                message: "something went wrong please try again",
              });
            }
            if (store) {
              if (store.otp === otp) {
                const storeUrlWithoutSpecailCharacters = store.storeName
                  .toLowerCase()
                  .replace(/[&\/\\#,+()$~%.₹'":*?|=-_<>{}@!^_]/g, "")
                  .trim();
                let storeUrl = storeUrlWithoutSpecailCharacters
                  .split(" ")
                  .join("-");
                const ckeckAlreadyStoreNameExists = await Store.find({
                  storeUrl: storeUrl,
                }).countDocuments();

                if (ckeckAlreadyStoreNameExists > 0) {
                  storeUrl = storeUrl + ckeckAlreadyStoreNameExists;
                } else {
                  storeUrl = storeUrl;
                }
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                  dd = "0" + dd;
                }
                if (mm < 10) {
                  mm = "0" + mm;
                }
                today = mm + "/" + dd + "/" + yyyy;

                (store.storeStartedDate = today),
                  (store.storeUrl = storeUrl.split(" ").join("-")),
                  (store.otp = ""),
                  (store.otpVerified = true),
                  store.save(async (error, result) => {
                    if (error) {
                      return res.status(401).json({
                        message: "something went wrong please try again",
                      });
                    } else {
                      const token1 = jwt.sign(
                        { _id: result._id, role: result.role },
                        JWT_SECRET
                      );
                      res.cookie("token", token1);
                      const token = await CryptoJS.AES.encrypt(
                        JSON.stringify(token1),
                        CRYPTOJS_KEY
                      ).toString();
                      return res.status(200).json({
                        token,
                      });
                    }
                  });
              } else {
                return res.status(401).json({
                  message: "Invalid OTP",
                });
              }
            } else {
              return res.status(401).json({
                message: "try to register first",
              });
            }
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.demoStore = async (req, res) => {
  const { loginId, storeName, storeCategory, storePlan, storeType } = req.body;
  await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
    async (error, store) => {
      if (store) {
        return res.status(401).json({
          message: "Your Store already exists",
        });
      }

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      today = mm + "/" + dd + "/" + yyyy;

      const _store = new Store({
        role: "store",
        otp: "",
        otpVerified: true,
        storePhoneNumber: loginId,
        storeVerified: true,
        storePlanType: "Free",
        storeName,
        storeCategory,
        storePlan,
        storeType,
        storeStartedDate: today,
        storeUrl: "demo-store",
      });
      _store.save((error, data) => {
        if (error) {
          return res.status(401).json({
            error: error,
          });
        } else {
          return res.status(200).json({
            message: "store created successfully",
          });
        }
      });
    }
  );
};

exports.getAllStoreList = async (req, res) => {
  try {
    await Store.find({ otpVerified: true })
      .sort("-createdAt")
      .exec((error, store) => {
        if (error) {
          console.log("Error at getting store list:-", error);
          return res.status(401).json({
            message: "Somthing went wrong..",
          });
        } else if (store) {
          return res.status(200).json({ store });
        } else {
          return res.status(401).json({
            message: "Somthing went wrong..",
          });
        }
      });
  } catch (error) {
    console.log("Error at Catch:-", error);
    return res.status(401).json({
      message: "Somthing went wrong..",
    });
  }
};


exports.addStoreTags = async (req, res) => {
  const {
    storeId,
    storeTags
  } = req.body;

  console.log(storeTags, storeId)

  const updateStoreTags = await Store.findOneAndUpdate(
    { _id: storeId },
    {
      $set: {
        storeTags
      },
    },
    { new: true, useFindAndModify: false },
    async (err, updatedUserInfo) => {
      if (err) {
        return res.status(400).json({ message: "No Such Store exists" });
      }
      if (updatedUserInfo) {
        return res.status(200).json({ message: "store tags upadted/added successfully" });
      }
    }
  );
}
