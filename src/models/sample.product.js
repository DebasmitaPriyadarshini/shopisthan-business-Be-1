const mongoose = require('mongoose')

const sampleProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
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
        required: true
    },
    productDescription: {
        type: String,
        require: true,
        trim: true
    },
    productPictures: [
        {
            img: { type: String }
        }
    ],
    productCatalog: {
        type: mongoose.Schema.Types.ObjectId, ref: 'sampleCatalog', required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'sampleStore', required: true

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    },
    updatedAt: Date,


}, { timestamps: true });


module.exports = mongoose.model("sampleProductSchema", sampleProductSchema)