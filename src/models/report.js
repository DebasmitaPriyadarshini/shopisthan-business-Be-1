const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema({
    massage: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model("Report", reportSchema)