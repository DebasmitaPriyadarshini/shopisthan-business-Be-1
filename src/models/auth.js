const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 30,
    },
    loginId: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    otp: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    // following: [{
    //   type: mongoose.Schema.Types.ObjectId, ref: 'Store'
    // }],
    phoneNo: {
      type: Number,
    },
    addressName: {
      type: String,
    },
    addressMobileNumber: {
      type: Number,
    },
    addressAddress: {
      type: String,
    },
    addressHouseName: {
      type: String,
    },
    addressAreaName: {
      type: String,
    },
    addressState: {
      type: String,
    },
    addressCity: {
      type: String,
    },
    addressPinCode: {
      type: String,
    },
    addressNearbyLocation: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
