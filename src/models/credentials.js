const mongoose = require('mongoose');
const credentailSchema = new mongoose.Schema({

    bussinessAppVersion: {
        type: String,
    },



}
    , { timestamps: true }
);

module.exports = mongoose.model('Credentail', credentailSchema);