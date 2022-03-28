const mongoose = require('mongoose')
const catalogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    catalogId: {
        type: String,
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Store',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    }
}, { timestamps: true });


module.exports = mongoose.model("Catalog", catalogSchema)