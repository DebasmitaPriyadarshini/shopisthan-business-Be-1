const Store = require("../models/store");
const Product = require("../models/product.model");
const Cart = require("../models/cart");
var CryptoJS = require("crypto-js");
const { CRYPTOJS_KEY } = require("../../config/keys");
// const { CRYPTOJS_KEY } = require("../../config/key");

exports.editProduct = async (req, res) => {
  const {
    productName,
    productMrpPrice,
    productPrice,
    productDescription,
    _id,
    productCatalog,
    productPricesWithType,
    productColor,
  } = req.body;

  if (Number(productPrice) > Number(productMrpPrice)) {
    return res.status(400).json({ message: "Product Discount Price too Long" });
  }

  let storeDetails = await Store.findOne({ _id: req.store._id })
    .select("storePlan")
    .populate({ path: "storePlan", select: "_id editProducts" })
    .exec();

  if (!storeDetails)
    return res.status(400).json({ message: "Store not exists" });

  const product = await Product.findOne({ _id: _id, storeId: req.store._id });

  if (!product) return res.status(400).json({ message: "Product not exists" });

  if (storeDetails.storePlan.editProducts) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          productName,
          productPrice,
          productDescription,
          productCatalog,
          productMrpPrice,
          productPricesWithType: productPricesWithType
            ? JSON.parse(productPricesWithType)
            : [],
          productColor: productColor ? JSON.parse(productColor) : [],
        },
      },
      { new: true, useFindAndModify: false },
      (err, updatedProductInfo) => {
        if (err) {
          return res.status(400).json({ err });
        }
        if (updatedProductInfo) {
          return res.status(201).json({ updatedProductInfo });
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ message: "Your store can't edit the product" });
  }
};

exports.editProductWithPicture = async (req, res) => {
  const {
    productName,
    productPrice,
    productMrpPrice,
    productDescription,
    _id,
    productCatalog,
    productPricesWithType,
    productColor,
  } = req.body;

  if (Number(productPrice) > Number(productMrpPrice)) {
    return res.status(400).json({ message: "Product Discount Price too Long" });
  }

  let storeDetails = await Store.findOne({ _id: req.store._id })
    .select("storePlan")
    .populate({ path: "storePlan", select: "_id editProducts" })
    .exec();
  if (!storeDetails)
    return res.status(400).json({ message: "Store not exists" });

  const product = await Product.findOne({ _id: _id, storeId: req.store._id });

  if (!product) return res.status(400).json({ message: "Product not exists" });

  if (storeDetails.storePlan.editProducts) {
    let productPictures = [];

    if (req.files.length > 0) {
      productPictures = req.files.map((file) => {
        return { img: file.location };
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          productName,
          productPrice,
          productDescription,
          productCatalog,
          productPictures,
          productMrpPrice,
          productPricesWithType: productPricesWithType
            ? JSON.parse(productPricesWithType)
            : [],
          productColor: productColor ? JSON.parse(productColor) : [],
        },
      },
      { new: true, useFindAndModify: false },
      (err, updatedProductInfo) => {
        if (err) {
          return res.status(400).json({ err });
        }
        if (updatedProductInfo) {
          return res.status(201).json({ updatedProductInfo });
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ message: "Your store can't edit the product" });
  }
};

exports.outOfStock = async (req, res) => {
  try {
    const { productOutOfStock, _id } = req.body;

    let storeDetails = await Store.findOne({ _id: req.store._id })
      .select("storePlan")
      .populate({ path: "storePlan", select: "_id stockProducts" })
      .exec();

    if (!storeDetails)
      return res.status(400).json({ message: "Store not exists" });
    if (storeDetails.storePlan.stockProducts) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: _id },
        { $set: { productOutOfStock } },
        { new: true, useFindAndModify: false },
        (err, updatedProductInfo) => {
          if (err) {
            return res.status(400).json({ err });
          }
          if (updatedProductInfo) {
            return res.status(201).json({ message: "updated successfully" });
          }
        }
      );
    } else {
      return res
        .status(400)
        .json({ message: "Your store can't make the stock changes" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.deleteProductById = async (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    let store = await Store.findOne({ _id: req.store._id })
      .select("storePlan")
      .populate({ path: "storePlan", select: "_id deleteProducts" })
      .exec();

    if (!store)
      return res.status(400).json({ error: "User does not contain store" });

    let product = await Product.findOne({ _id: productId });
    if (!product)
      return res.status(400).json({ error: "Product does not exists" });

    if (store.storePlan.deleteProducts) {
      deleteProductFromCart = await Cart.updateMany(
        { storeId: store._id },
        {
          $pull: {
            cartItems: {
              product: productId,
            },
          },
        }
      ).exec();
      await Product.deleteOne({ _id: productId }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    } else {
      return res
        .status(400)
        .json({ message: "Your store can't delete the product" });
    }
  } else {
    return res.status(400).json({ error: "Params are required" });
  }
};

const addProduct = async (req, res, storeCategory, storeId, noOfProducts) => {
  const {
    productName,
    productPrice,
    productDescription,
    productCatalog,
    productMrpPrice,
    productPricesWithType,
    productColor,
  } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.location };
    });
  }

  if (Number(productPrice) > Number(productMrpPrice)) {
    return res.status(400).json({ message: "Product Discount Price too Long" });
  }

  product = new Product({
    productName,
    productPrice,
    productMrpPrice,
    productDescription,
    productCatalog,
    productPictures,
    productParentCategory: storeCategory,
    storeId: storeId,
    productId: Number(noOfProducts) + 1,
    productPricesWithType: productPricesWithType
      ? JSON.parse(productPricesWithType)
      : [],
    productColor: productColor ? JSON.parse(productColor) : [],
  });

  await product.save((error, product) => {
    if (error) return res.status(400).json({ "error ": error });
    if (product) {
      return res.status(200).json({ product });
    }
  });
};

exports.createProduct = async (req, res) => {
  try {
    let store = await Store.findOne({ _id: req.store._id })
      .select("storePlan storeCategory ")
      .populate({
        path: "storePlan",
        select: "_id noOfProducts unlimitedProduct",
      })
      .exec();
    if (!store) {
      return res.status(400).json({ message: "Something went worng" });
    }
    if (store) {
      const productLimit = store.storePlan.noOfProducts;
      const noOfStoreProducts = await Product.find({
        storeId: req.store._id,
      }).countDocuments();

      const noOfProductsCount = await Product.find({})
        .sort({ _id: -1 })
        .limit(1);
      if (noOfProductsCount.length === 0) {
        var noOfProducts = 100;
      } else {
        var noOfProducts = noOfProductsCount[0].productId;
      }

      if (store.storePlan.unlimitedProduct) {
        addProduct(req, res, store.storeCategory, store._id, noOfProducts);
      } else {
        if (productLimit > noOfStoreProducts) {
          addProduct(req, res, store.storeCategory, store._id, noOfProducts);
        } else {
          return res
            .status(401)
            .json({ message: "Not added due to product limit" });
        }
      }
    }
  } catch (error) {
    console.clear();
  }
};

exports.allProducts = async (req, res) => {
  try {
    let storeDetails = await Store.findOne({ _id: req.store._id });
    if (storeDetails) {
      const productData = await Product.find({ storeId: storeDetails._id })
        .select("-createdBy -createdAt  -updatedAt -__v -createdBy -storeId")
        .populate({ path: "productCatalog", select: "_id name" })
        .sort("-createdAt")
        .exec();
      const product = await CryptoJS.AES.encrypt(
        JSON.stringify(productData),
        CRYPTOJS_KEY
      ).toString();
      return res.status(200).json({
        product,
      });
    } else {
      return res.status(400).json({ message: "Store not Exists" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getStoreProductDetailsByStoreUrl = async (req, res) => {
  const { storeUrl } = req.params;
  if (storeUrl) {
    const store = await Store.findOne({ storeUrl: storeUrl });
    if (store) {
      await Product.find({ storeId: store._id, productOutOfStock: "No" })
        .populate({ path: "productCatalog", select: "_id name" })
        .select("-productOutOfStock -createdAt -updatedAt  -__v")
        .sort("-createdAt")
        .exec(async (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ message: "Something went wrong" });
          }
          if (result) {
            const product = await CryptoJS.AES.encrypt(
              JSON.stringify(result),
              CRYPTOJS_KEY
            ).toString();
            return res.status(200).json({ product });
          } else {
            return res.status(400).json({ message: "Something went wrong" });
          }
        });
    } else {
      return res.status(400).json({ message: "Store doesn't exists" });
    }
  } else {
    return res.status(400).json({ message: "Params required" });
  }
};

exports.getStoreProductListByStoreId = async (req, res) => {
  const { storeId } = req.params;
  if (storeId) {
    await Store.findOne({ _id: storeId }).exec(async (error, store) => {
      if (error) {
        return res.status(400).json({ message: "Store doesn't exists" });
      }
      if (store) {
        await Product.find({ storeId: store._id, productOutOfStock: "No" })
          .populate({ path: "productCatalog", select: "_id name" })
          .select("-productOutOfStock -createdAt -updatedAt  -__v")
          .sort("-createdAt")
          .exec(async (err, result) => {
            if (err) {
              console.log(err);
              return res.status(400).json({ message: "Something went wrong" });
            }
            if (result) {
              return res.status(200).json({ product: result });
            } else {
              return res.status(400).json({ message: "Something went wrong" });
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
exports.getProductDetailsById = async (req, res) => {
  const { productId } = req.params;
  if (productId) {
    await Product.findOne({ productId: productId, productOutOfStock: "No" })
      .populate({ path: "productCatalog", select: "_id name" })
      .select("-productOutOfStock -createdAt -updatedAt  -__v")
      .exec(async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ message: "Something went wrong" });
        }
        if (result) {
          const store = await Store.findOne({ _id: result.storeId })
            .select(
              "_id storeName storeUrl storeProfilePicture storeCategory storeState storeCity  storeAddress storeDescription storePinCode storeSince"
            )
            .exec(async (err, storeData) => {
              if (err) {
                return res
                  .status(400)
                  .json({ message: "Something went wrong" });
              }
              if (storeData) {
                const storeDetails = await CryptoJS.AES.encrypt(
                  JSON.stringify(storeData),
                  CRYPTOJS_KEY
                ).toString();
                const productDetails = await CryptoJS.AES.encrypt(
                  JSON.stringify(result),
                  CRYPTOJS_KEY
                ).toString();
                return res.status(200).json({ productDetails, storeDetails });
              } else {
                return res.status(400).json({ message: "No such Product" });
              }
            });
        } else {
          return res.status(400).json({ message: "No such Product" });
        }
      });
  } else {
    return res.status(400).json({ message: "Params required" });
  }
};

exports.getAllProductList = async (req, res) => {
  try {
    const store = await Store.find({
      otpVerified: true,
      showInMarketPlace: true,
    })
      .select("_id")
      .exec();
    // await Product.find({ productOutOfStock: "No", storeId: { $in: store } })

    await Product.find({ productOutOfStock: "No" })
      .populate({ path: "productCatalog", select: "_id name" })
      .populate({ path: "storeId", select: "_id storeName" })
      .sort("-createdAt")
      .exec((error, product) => {
        if (error) {
          console.log("Error at getting store list:-", error);
          return res.status(401).json({
            message: "Somthing went wrong..",
          });
        } else if (product) {
          return res.status(200).json({ product });
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
