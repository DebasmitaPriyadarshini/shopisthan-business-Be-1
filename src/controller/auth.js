const Store = require("../models/store");
const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/keys");
const { generateOTP } = require("../common-middleware");
var unirest = require("unirest");
const {
  FAST_2_SMS_AUTH,
  FAST_2_SMS_ROT,
  FAST_2_SMS_SEN_ID,
  FAST_2_SMS_MSG_OTP,
  CRYPTOJS_KEY,
} = require("../../config/keys");
var CryptoJS = require("crypto-js");

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "SignOut Successfully...!",
  });
};

const sendOTPForDemoStore = async (loginId, req, res) => {
  await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
    async (error, store) => {
      if (error) {
        return res.status(401).json({
          message: "Something went wrong try again later...",
        });
      }
      if (store) {
        const otp = "999999";
        console.log(otp);

        store.otp = otp;
        store.save((error, result) => {
          if (error) {
            return res.status(401).json({ message: "Something went Wrong" });
          } else {
            return res.status(200).json({ message: "Otp sent successfully" });
          }
        });
      } else {
        return res.status(401).json({
          message: "No such store exists",
        });
      }
    }
  );
};

exports.signin = async (req, res) => {
  try {
    const { loginId } = req.body;

    if (loginId == "9999999999") {
      return sendOTPForDemoStore(loginId, req, res);
    }

    await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
      async (error, store) => {
        if (error) {
          return res.status(401).json({
            message: "Something went wrong try again later...",
          });
        }

        if (store) {
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
              store.otp = otp;
              store.save((error, result) => {
                if (error) {
                  return res
                    .status(401)
                    .json({ message: "Something went Wrong" });
                } else {
                  return res
                    .status(200)
                    .json({ message: "Otp sent successfully" });
                }
              });
            } else {
              return res.status(401).json({
                message: "Something went wrong!!!",
              });
            }
          });
        } else {
          return res.status(401).json({
            message: "Account does not exist",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: err,
    });
  }
};

exports.verifiy = async (req, res) => {
  await Store.findOne({ storePhoneNumber: req.body.loginId }).exec(
    async (error, store) => {
      if (error) return res.status(401).json({ message: "Store not found" });
      if (store) {
        if (store.otp === req.body.otp && store.role === "store") {
          const updateStore = await Store.findOneAndUpdate(
            { storePhoneNumber: req.body.loginId },
            {
              $unset: {
                otp: "",
              },
            },
            { new: true, useFindAndModify: false }
          ).exec();

          const token1 = jwt.sign(
            { _id: store._id, role: store.role },
            JWT_SECRET
          );
          console.log("TOKEN", token1);
          res.cookie("token", token1);
          const token = await CryptoJS.AES.encrypt(
            JSON.stringify(token1),
            CRYPTOJS_KEY
          ).toString();
          return res.status(200).json({
            token,
          });
        } else {
          return res.status(401).json({
            message: "Invalid OTP",
          });
        }
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    }
  );
};

exports.storeSigninOtp = async (req, res) => {
  const { loginId } = req.body;

  await Store.findOne({ storePhoneNumber: loginId, otpVerified: true }).exec(
    async (error, store) => {
      if (store) {
        return res.status(401).json({
          message: "Your Store already exists",
        });
      }

      const otp = generateOTP(6);
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

exports.userSignin = async (req, res) => {
  try {
    const { loginId } = req.body;
    await User.findOne({ loginId: loginId }).exec(async (error, user) => {
      if (error)
        return res.status(401).json({
          message: "Something went wrong try again later...",
        });

      const otp = generateOTP(6);
      console.log(otp);
      // var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
      // req.headers({
      //   authorization: FAST_2_SMS_AUTH,
      //   "Content-Type": "application/json",
      // });

      // req.form({
      //   route: FAST_2_SMS_ROT,
      //   sender_id: FAST_2_SMS_SEN_ID,
      //   message: FAST_2_SMS_MSG_OTP,
      //   variables_values: otp,
      //   flash: 0,
      //   numbers: loginId,
      // });

      // req.end(async function (response) {
      //   if (response.error) {
      //     return res.status(401).json({
      //       message: response.error,
      //     });
      //   }
      //   if (response.body.return) {
      //     console.log(response.body)
      if (user) {
        user.otp = otp;
        user.save((error, result) => {
          if (error) {
            return res.status(401).json({ message: "Something went Wrong" });
          } else {
            console.log("Otp Saved");
            return res.status(200).json({ message: "Otp Sent Successfully" });
          }
        });
      } else {
        const _user = new User({
          loginId,
          role: "user",
          otp: otp,
          verified: false,
          phoneNo: loginId,
        });
        _user.save((error, data) => {
          if (error) {
            return res.status(401).json({
              error: error,
            });
          } else {
            return res.status(200).json({ message: "Otp Sent Successfully" });
          }
        });
      }
      //   } else {
      //     return res.status(401).json({
      //       message: "Something went wrong!!!",
      //     });
      //   }
      // });
    });
  } catch (err) {
    return res.status(401).json({
      message: err,
    });
  }
};

exports.userOtpVerifiy = async (req, res) => {
  await User.findOne({ loginId: req.body.loginId }).exec(
    async (error, user) => {
      if (error) return res.status(401).json({ message: "User not found" });
      if (user) {
        if (user.otp === req.body.otp && user.role === "user") {
          const updateUser = await User.findOneAndUpdate(
            { loginId: req.body.loginId },
            {
              $unset: {
                otp: "",
              },
            },
            { new: true, useFindAndModify: false }
          ).exec();

          const token1 = jwt.sign(
            { _id: user._id, role: user.role },
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
        } else {
          return res.status(401).json({
            message: "Invalid OTP",
          });
        }
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    }
  );
};
