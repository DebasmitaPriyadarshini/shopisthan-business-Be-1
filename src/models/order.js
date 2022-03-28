const mongoose = require("mongoose");
// A
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    addressState: {
      type: String,
    },
    addressCity: {
      type: String,
    },
    addressPinCode: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        // storeId: {
        //   type:mongoose.Schema.Types.ObjectId,
        //   ref: "Store",
        // },
        payablePrice: {
          type: Number,
          required: true,
        },
        productName: {
          type: String,
        },
        productPictures: {
          type: String,
        },
        productDescription: {
          type: String,
        },
        productSize: {
          type: String,
        },
        productColor: {
          type: String,
        },
        productColorCode: {
          type: String,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
        productStatus: {
          type: String,
        },
        productShipped: {
          type: String,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Confirm", "Not Available"],
    },
    paymentType: {
      type: String,
      enum: ["COD", "card"],
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      require: true,
    },

    // storeID: [
    //   {
    //     storeId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Store",
    //     }
    //   }

    // ],
    orderCreationId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
