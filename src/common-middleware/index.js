const jwt = require("jsonwebtoken");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const shortid = require("shortid");
const multer = require("multer");
const { AWS_ACCESS_KEY } = require("../../config/keys");
const { AWS_SECRET_KEY } = require("../../config/keys");
const { JWT_SECRET, CRYPTOJS_KEY } = require("../../config/keys");
var CryptoJS = require("crypto-js");

exports.generateOTP = (otp_length) => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    // const token = req.headers.authorization.split(" ")[1];
    // const store = jwt.verify(token, JWT_SECRET);
    // req.store = store;
    const storedToken = req.headers.authorization;
    var tokenBytes = CryptoJS.AES.decrypt(storedToken, CRYPTOJS_KEY);
    const decryptedToken = JSON.parse(tokenBytes.toString(CryptoJS.enc.Utf8));
    const token = decryptedToken.split(" ")[1];
    const store = jwt.verify(token, JWT_SECRET);
    req.store = store;
  } else {
    return res.status(400).json({ message: "Authorization Required" });
  }

  next();
};

exports.storeMiddleware = (req, res, next) => {
  if (req.store.role !== "store") {
    return res.status(400).json({ message: "store access denied" });
  }
  next();
};

exports.requireUserSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const userToken = req.headers.authorization;
    var tokenBytes = CryptoJS.AES.decrypt(userToken, CRYPTOJS_KEY);
    const decryptedToken = JSON.parse(tokenBytes.toString(CryptoJS.enc.Utf8));
    const token = decryptedToken.split(" ")[1];
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization Required" });
  }

  next();
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "user access denied" });
  }
  next();
};

const s3 = new aws.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only JPG, JPEG and PNG is allowed!"),
      false
    );
  }
};

const getBucketName = () => {
  if (process.env.NODE_ENV === "production") {
    return "shopisthanproductimagesbucket";
  } else {
    return "aws-testimages-bucket";
  }
};

// const getBucketName1 = (req) => {
//   return req.body.bucketName;
// };

exports.uploadS3 = multer({
  storage: multerS3({
    fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 10, // 10 MB (max file size)
    },
    s3: s3,
    // bucket: "shopisthanproductimagesbucket",
    bucket: getBucketName(),
    // bucket: function (req, file, cb) {
    //   const bucketName = getBucketName1(req);
    //   cb(null, bucketName);
    // },
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  }),
});
