const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["store"],
      default: "store",
    },
    otp: {
      type: String,
    },
    storeName: {
      type: String,
    },
    storeType: {
      type: String,
    },
    storeUrl: {
      type: String,
    },
    // followers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    storeCatalogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catalog",
      },
    ],
    storeProfilePicture: {
      img: {
        type: String,
        // default: "https://aws-testimages-bucket.s3.amazonaws.com/wiPW4BnBo-b36485aaabd4f81835c15a1440d59eea.jpg"
      },
    },
    storeBackgroundPicture: {
      img: { type: String },
    },
    storeCategory: {
      type: String,
    },
    storeState: {
      type: String,
      trim: true,
    },
    storeStartedDate: {
      type: String,
      trim: true,
    },
    storeReNewPlanDate: {
      type: String,
      trim: true,
    },
    storeCity: {
      type: String,
      trim: true,
    },
    storePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StorePlan",
    },
    storePlanType: {
      type: String,
      enum: ["Paid", "Free"],
      default: "Paid",
    },
    storePhoneNumber: {
      type: Number,
      trim: true,
    },
    storeEmail: {
      type: String,
      trim: true,
    },
    storeInstagramUrl: {
      type: String,
      trim: true,
    },
    storeFacebookUrl: {
      type: String,
      trim: true,
    },
    storeAddress: {
      type: String,
    },
    storeDescription: {
      type: String,
    },
    storePinCode: {
      type: String,
      trim: true,
    },
    paymentType: {
      type: String,
    },
    storeSince: {
      type: Number,
      trim: true,
      default: null,
    },
    orderCreationId: {
      type: String,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      trim: true,
    },
    storeVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    showInMarketPlace: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    productFeature: {
      type: Boolean,
      default: true,
      required: true,
    },
    catalogFeature: {
      type: Boolean,
      default: true,
      required: true,
    },
    orderFeature: {
      type: Boolean,
      default: true,
      required: true,
    },
    customerFeature: {
      type: Boolean,
      default: true,
      required: true,
    },
    storeTags: [String],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", shopSchema);
