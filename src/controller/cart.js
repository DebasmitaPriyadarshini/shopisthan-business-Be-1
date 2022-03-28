const Cart = require("../models/cart");
var CryptoJS = require("crypto-js");
const { CRYPTOJS_KEY } = require("../../config/keys");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, {
      upsert: true,
      useFindAndModify: false,
    })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}

exports.addItemToCart = (req, res) => {
  var bytes = CryptoJS.AES.decrypt(req.body.payload, CRYPTOJS_KEY);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      //if cart already exists then update cart by  quantity
      let promiseArray = [];

      decryptedData.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "cartItems.product": product };
          update = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        promiseArray.push(runUpdate(condition, update));
      });
      Promise.all(promiseArray)
        .then((response) => res.status(201).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      //if cart not exist then create a new cart
      const cart = new Cart({
        user: req.user._id,
        cartItems: decryptedData.cartItems,
        storeId: decryptedData.storeId,
      });
      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          return res.status(201).json({ cart });
        }
      });
    }
  });
};

exports.getCartItems = async (req, res) => {
  try {
    let cartDetails = await Cart.findOne({ user: req.user._id });
    if (cartDetails) {
      await Cart.findOne({ user: req.user._id })
        .populate(
          "cartItems.product",
          "_id productName productPrice productPictures storeId productDescription"
        )
        .exec(async (error, cart) => {
          if (error) return res.status(400).json({ error });
          if (cart) {
            let cartItems = {};
            cart.cartItems.forEach((item, index) => {
              if (item.product !== null) {
                cartItems[item.product._id.toString()] = {
                  _id: item.product._id.toString(),
                  productName: item.product.productName,
                  img: item.product.productPictures[0].img,
                  size: item.size ? item.size : null,
                  colorName: item.colorName ? item.colorName : null,
                  colorCode: item.colorCode ? item.colorCode : null,
                  productPrice: item.productPrice,
                  qty: item.quantity,
                  storeId: item.product.storeId,
                  productDescription: item.product.productDescription,
                };
              }
            });

            const payload = await CryptoJS.AES.encrypt(
              JSON.stringify(cartItems),
              CRYPTOJS_KEY
            ).toString();
            return res.status(200).json({ payload });
          }
        });
    } else {
      return res.status(200).json({ message: "No cart" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.removeCartItems = async (req, res) => {
  const { productId } = req.body.payload;

  const totalNoOfItems = await Cart.findOne({ user: req.user._id }).exec();

  if (totalNoOfItems) {
    if (totalNoOfItems.cartItems && totalNoOfItems.cartItems.length === 1) {
      await Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) return res.status(202).json({ result });
      });
    } else {
      if (productId) {
        await Cart.updateOne(
          { user: req.user._id },
          {
            $pull: {
              cartItems: {
                product: productId,
              },
            },
          }
        ).exec((error, result) => {
          if (error) return res.status(400).json({ error });
          if (result) {
            return res.status(202).json({ result });
          }
        });
      }
    }
  }
};
