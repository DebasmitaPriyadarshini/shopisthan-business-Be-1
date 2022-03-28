const Catalog = require("../models/catalog");
const Store = require("../models/store");
var CryptoJS = require("crypto-js");
const { CRYPTOJS_KEY } = require("../../config/keys");

const ad = async (name, storeId, res) => {
  if (!name) {
    return res.status(400).json({ message: "Enter the name" });
  }

  if (name === "All" || name === "all") {
    return res.status(400).json({ message: "Enter another name" });
  }
  const catalogId = await Catalog.find({}).sort({ _id: -1 }).limit(1);
  catalog = new Catalog({
    name: name,
    storeId: storeId,
    catalogId: Number(catalogId[0].catalogId) + 1,
  });

  await catalog.save((error, catalog) => {
    if (error) {
      return res
        .status(400)
        .json({ message: "something went wrong please try again later" });
    }

    if (catalog) {
      return res.status(201).json({ message: "added successfully" });
      // Store.findByIdAndUpdate(
      //   storeId,
      //   {
      //     $push: { storeCatalogs: catalog._id },
      //   },
      //   {
      //     new: true,
      //     useFindAndModify: false,
      //   },
      //   (err, result) => {
      //     if (err) {
      //       return res.status(422).json({ message: "something went wrong please try again later" });
      //     }
      //     if (result) {
      //       return res.status(201).json({ message: "added successfully" })
      //     }
      //   }
      // );
    }
  });
};

exports.allCatalog = async (req, res) => {
  try {
    let storeDetails = await Store.findOne({ _id: req.store._id });

    if (storeDetails) {
      const a2 = await Catalog.find({ storeId: storeDetails._id })
        .select("name catalogId")
        .sort("-createdAt")
        .exec();
      const a1 = await Catalog.find({ name: "All" })
        .select("name catalogId")
        .exec();
      const catalogData = [...a1, ...a2];

      const catalog = await CryptoJS.AES.encrypt(
        JSON.stringify(catalogData),
        CRYPTOJS_KEY
      ).toString();
      return res.status(200).json({
        catalog,
      });
    } else {
      return res.status(400).json({ message: "Store not Exists" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.addCatalog = async (req, res) => {
  try {
    let store = await Store.findOne({ _id: req.store._id });
    if (store) {
      ad(req.body.name, req.store._id, res);
    } else {
      return res.status(400).json({ message: "Something went worng" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.editCatalog = async (req, res) => {
  const { _id, name } = req.body;

  let store = await Store.findOne({ _id: req.store._id });
  //   .select("storePlan")
  //   .populate({ path: "storePlan", select: "_id editCatalog" })
  //   .exec();

  // if (!store) {
  //   return res.status(400).json({ message: "Something went worng" });
  // }

  if (store) {
    const storeCatalog = await Catalog.findOne({
      _id: _id,
      storeId: req.store._id,
    });
    if (!storeCatalog)
      return res
        .status(400)
        .json({ message: "This catalog not belong to your store" });

    const updatedCatalog = await Catalog.findOneAndUpdate(
      { _id: _id, storeId: req.store._id },
      {
        $set: {
          name,
        },
      },
      { new: true, useFindAndModify: false },
      (err, updatedCatalogInfo) => {
        if (err) {
          return res.status(400).json({ err });
        }
        if (updatedCatalogInfo) {
          return res.status(201).json({ message: "edited successfully" });
        }
      }
    );
  } else {
    return res.status(400).json({ message: "Something went worng" });
  }
};

exports.deleteCatalogById = async (req, res) => {
  const { _id } = req.body.payload;
  if (_id) {
    let store = await Store.findOne({ _id: req.store._id });
    // .select("storePlan")
    // .populate({ path: "storePlan", select: "_id deleteCatalog" })
    // .exec();

    // if (!store) {
    //   return res.status(400).json({ message: "Something went worng" });
    // }

    if (store) {
      const updatedCatalog = await Catalog.deleteOne({ _id: _id }).exec(
        (error, result) => {
          if (error) return res.status(400).json({ error });
          if (result) {
            res.status(202).json({ message: "deleted successfully" });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "Something went worng" });
    }
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getStoreCatalogDetailsByStoreUrl = async (req, res) => {
  const { storeUrl } = req.params;
  if (storeUrl) {
    const store = await Store.findOne({ storeUrl: storeUrl });
    if (store) {
      await Catalog.find({ storeId: store._id })
        .select("_id name")
        .sort("-createdAt")
        .exec(async (err, result) => {
          if (err) {
            return res.status(400).json({ message: "Something went wrong" });
          }
          if (result) {
            const catalog = await CryptoJS.AES.encrypt(
              JSON.stringify(result),
              CRYPTOJS_KEY
            ).toString();
            return res.status(200).json({ catalog });
          } else {
            return res.status(400).json({ message: "Store doesn't exists" });
          }
        });
    } else {
      return res.status(400).json({ message: "Store doesn't exists" });
    }
  } else {
    return res.status(400).json({ message: "Params required" });
  }
};

exports.getStoreCatalogListByStoreId = async (req, res) => {
  const { storeId } = req.params;
  if (storeId) {
    await Store.findOne({ _id: storeId }).exec(async (error, store) => {
      if (error) {
        return res.status(400).json({ message: "Store doesn't exists" });
      }
      if (store) {
        await Catalog.find({ storeId: store._id })
          .select("_id name")
          .sort("-createdAt")
          .exec(async (err, result) => {
            if (err) {
              return res.status(400).json({ message: "Store doesn't exists" });
            }
            if (result) {
              return res.status(200).json({ catalog: result });
            } else {
              return res.status(400).json({ message: "Store doesn't exists" });
            }
          });
      } else {
        return res.status(400).json({ message: "Store doesn't exists" });
      }
    });
  } else {
    return res.status(400).json({ message: "Params required" });
  }
};

exports.getAllCatalogList = async (req, res) => {
  try {
    const store = await Store.find({
      otpVerified: true,
      showInMarketPlace: true,
    })
      .select("_id")
      .exec();
    // await Catalog.find({ storeId: { $in: store } });
    await Catalog.find({})
      .sort("-createdAt")
      .exec((error, catalog) => {
        if (error) {
          console.log("Error at getting store list:-", error);
          return res.status(401).json({
            message: "Somthing went wrong..",
          });
        } else if (catalog) {
          return res.status(200).json({ catalog });
        } else {
          return res.status(401).json({
            message: "Somthing went wrong..",
          });
        }
      });
  } catch (error) {
    console.log("Error at Catch:-", error);
    return res.status(401).json({
      message: "Somthing went wrong..",
    });
  }
};
