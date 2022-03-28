const Credentail = require("../models/credentials");
var CryptoJS = require("crypto-js");
const { CRYPTOJS_KEY } = require("../../config/keys");

exports.credentialData = async (req, res) => {
    try {
        const a2 = await Credentail.find({}).exec(async (err, result) => {
            if (err) {
                return res.status(400).json({ message: "db error" });
            } else {
                const data = await CryptoJS.AES.encrypt(JSON.stringify(result), CRYPTOJS_KEY).toString();
                return res.status(200).json({
                    data
                });
            }
        })
    } catch (error) {
        return res.status(400).json({ message: "error" });
    }
}


exports.setBussinessAppVersion = (req, res) => {
    const credentialObj = {
        bussinessAppVersion: req.body.bussinessAppVersion,
    };
    if (req.body.bussinessAppVersion) {
        const data = new Credentail(credentialObj);
        data.save((error, result) => {
            if (error) return res.status(400).json({ error });
            if (data) {
                return res.status(201).json({ message: data });
            }
        });
    } else {
        return res.status(400).json({ message: "bussiness app version required" });
    }

}


exports.updateBussinessAppVersion = async (req, res) => {
    const {
        _id,
        bussinessAppVersion
    } = req.body;

    const updatedBussinessAppVersion = await Credentail.findOneAndUpdate(
        { _id: _id },
        {
            $set: {
                bussinessAppVersion
            },
        },
        { new: true, useFindAndModify: false },
        (err, updated) => {
            if (err) {
                return res.status(400).json({ err });
            }
            if (updated) {
                return res.status(201).json({ message: updated });
            }
        }
    );
};




