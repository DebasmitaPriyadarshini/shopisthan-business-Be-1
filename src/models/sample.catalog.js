const mongoose = require('mongoose')
const sampleCatalogSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId, ref: 'sampleStore',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    }
}, { timestamps: true });


module.exports = mongoose.model("sampleCatalog", sampleCatalogSchema)