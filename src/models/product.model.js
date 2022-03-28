const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productMrpPrice: {
      type: Number,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productDescription: {
      type: String,
      require: true,
      trim: true,
    },
    productPictures: [
      {
        img: { type: String },
      },
    ],
    productOutOfStock: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    // productDiscount: {
    //     type: String,
    //     enum: ['Yes', 'No'],
    //     default: 'No'
    // },
    productDiscountedPrice: {
      type: Number,
    },
    // productDiscountedPercentage: {
    //     type: Number,
    // },
    productCatalog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
      required: true,
    },
    productParentCategory: {
      type: String,
      require: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    productPricesWithType: [
      {
        size: { type: String },
        productMrpPrice: { type: Number },
        productPrice: { type: Number },
        place: { type: Number },
      },
    ],
    productColor: [
      {
        name: { type: String },
        hexCode: { type: String },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
