const mongoose = require("mongoose");
const storePlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    planDescription: {
      type: String,
    },
    planType: {
      type: String,
      enum: ['Paid', 'Free'],
      default: 'Paid',
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    noOfProducts: {
      type: Number,
      required: true,
    },
    noOfCatalogs: {
      type: Number,
      required: true,
    },
    deleteProducts: {
      type: Boolean,
      required: true,
    },
    editProducts: {
      type: Boolean,
      required: true,
    },
    stockProducts: {
      type: Boolean,
      required: true,
    },
    editCatalog: {
      type: Boolean,
      required: true,
    },
    deleteCatalog: {
      type: Boolean,
      required: true,
    },
    paymentOtpion: {
      type: Boolean,
      required: true,
    },
    shippingOptions: {
      type: Boolean,
      required: true,
    },
    discountOption: {
      type: Boolean,
      required: true,
    },
    unlimitedProduct: {
      type: Boolean,
      required: true,
    },
    unlimitedCatalog: {
      type: Boolean,
      required: true,
    },
    orderSMS: {
      type: Boolean,
      required: true,
    },
    storeLookTheme: {
      type: String,
      required: true,
    },
    transactionCharges: {
      type: Number,
      required: true,
    },
    selfDomain: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StorePlan", storePlanSchema);
