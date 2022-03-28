const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./config/keys");

// for http to https request
// if (process.env.NODE_ENV == "production") {
//   const enforce = require("express-sslify");
//   app.use(enforce.HTTPS({ trustProtoHeader: true }));
// }

const userRoutes = require("./src/routes/auth.route");
const storeRoutes = require("./src/routes/store");
const productRoutes = require("./src/routes/product.route");
const oderRoutes = require("./src/routes/order");
const userinitialdata = require("./src/routes/userinitialdata");
const catloc = require("./src/routes/catloc");
const catalog = require("./src/routes/catalog");
const cart = require("./src/routes/cart");
const credentialsRoutes = require("./src/routes/credentials");

env.config();

mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log("Err", err);
  });

app.use(cors());
// app.use(bodyParser.json())
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", storeRoutes);
app.use("/api", productRoutes);
app.use("/api", oderRoutes);
app.use("/api", userinitialdata);
app.use("/api", catloc);
app.use("/api", catalog);
app.use("/api", cart);
app.use("/api", credentialsRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Shopisthan Backend" });
});

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static("client/build"));
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});