var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/products");
var cartRouter = require("./routes/carts");
var adminRouter = require("./routes/admin");
var searchRouter = require("./routes/searchs");
var petCareRouter = require("./routes/petCare");
var paymentRouter = require("./routes/payment");
var notificationRouter = require("./routes/notification");
var productCategoryRoter = require("./routes/productCategory");
var chatRouter = require("./routes/chat");

var app = express();
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/admin", adminRouter);
app.use("/searchs", searchRouter);
app.use("/pet-care", petCareRouter);
app.use("/pay", paymentRouter);
app.use("/notification", notificationRouter);
app.use("/product-categories", productCategoryRoter);
app.use("/chat", chatRouter);

module.exports = app;
