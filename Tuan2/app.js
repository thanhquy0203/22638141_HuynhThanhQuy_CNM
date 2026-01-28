require("dotenv").config();

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret_key_change_me",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

// variables global cho view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", authRoutes);
app.use("/products", productRoutes);

// home redirect
app.get("/", (req, res) => res.redirect("/products"));

app.listen(3000, () => console.log("http://localhost:3000"));
