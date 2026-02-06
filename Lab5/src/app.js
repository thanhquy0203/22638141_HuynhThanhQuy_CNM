require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const productRoutes = require("./routes/product.route");
app.use("/", productRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
