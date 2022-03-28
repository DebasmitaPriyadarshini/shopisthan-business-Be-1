const mongoose = require("mongoose");


const sampleShopSchema = new mongoose.Schema(
    {
        storeName: {
            type: String,
        },
        storeProfilePicture: {
            img: {
                type: String,
                // default: "https://aws-testimages-bucket.s3.amazonaws.com/wiPW4BnBo-b36485aaabd4f81835c15a1440d59eea.jpg"
            },

        },
        storeCategory: {
            type: String,
        },
        storeState: {
            type: String,
            trim: true
        },
        storeCity: {
            type: String,
            trim: true,
        },
        storeAddress: {
            type: String,
        },
        storeDescription: {
            type: String,
            default: "N.A",
        },
        storePinCode: {
            type: String,
            trim: true,
        },
        storeSince: {
            type: Number,
            trim: true,
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff"
        }


    },
    { timestamps: true }
);

module.exports = mongoose.model("sampleStore", sampleShopSchema);
