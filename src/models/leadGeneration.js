const mongoose = require('mongoose');


const leadGenerationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 30,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    comments: {
        type: String,
        max: 200
    },
    // verified: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
    // otp: {
    //     type: String,
    // },
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId, ref: 'User'
    // }


}, { timestamps: true });

module.exports = mongoose.model('LeadGeneration', leadGenerationSchema);
