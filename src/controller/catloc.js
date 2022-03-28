const StorePlan = require("../models/store.plan");
const Catalog = require("../models/catalog");
const LeadGeneration = require("../models/leadGeneration");

exports.addStorePlan = (req, res) => {
  const storePlanObj = {
    planName: req.body.planName,
    planDescription: req.body.planDescription,
    planType: req.body.planType,
    planPrice: req.body.planPrice,
    noOfProducts: req.body.noOfProducts,
    noOfCatalogs: req.body.noOfCatalogs,
    deleteProducts: req.body.deleteProducts,
    editProducts: req.body.editProducts,
    stockProducts: req.body.stockProducts,
    editCatalog: req.body.editCatalog,
    deleteCatalog: req.body.deleteCatalog,
    paymentOtpion: req.body.paymentOtpion,
    shippingOptions: req.body.shippingOptions,
    discountOption: req.body.discountOption,
    unlimitedProduct: req.body.unlimitedProduct,
    unlimitedCatalog: req.body.unlimitedCatalog,
    orderSMS: req.body.orderSMS,
    storeLookTheme: req.body.storeLookTheme,
    transactionCharges: req.body.transactionCharges,
    selfDomain: req.body.selfDomain,
  };
  const storePlan = new StorePlan(storePlanObj);
  storePlan.save((error, plan) => {
    if (error) return res.status(400).json({ error });
    if (plan) {
      return res.status(201).json({ plan });
    }
  });
};

exports.addCatalog = (req, res) => {
  const catalogObj = {
    name: req.body.name,
    catalogId: 100,
  };

  const cat = new Catalog(catalogObj);
  cat.save((error, catalog) => {
    if (error) return res.status(400).json({ error });
    if (catalog) {
      return res.status(201).json({ catalog });
    }
  });
};

exports.addLeadGeneration = async (req, res) => {
  const check = await LeadGeneration.findOne({
    phoneNumber: req.body.phoneNumber,
  }).exec();
  if (check) {
    return res.status(400).json({
      message:
        "Seems like you have already registered your store. Kindly wait till the time our team connects you . If you still want to contact us kindly send email on info@shopisthan.com",
    });
  }

  const leadGenerationObj = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    comments: req.body.comments,
  };

  const lead = new LeadGeneration(leadGenerationObj);
  lead.save((error, lead) => {
    if (error) {
      console.log("error", error);
      return res
        .status(400)
        .json({ message: "Oopps ! Something went wrong.Try again" });
    }
    if (lead) {
      return res.status(201).json({ lead });
    }
  });
};
