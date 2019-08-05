var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var gamesRoute = require("./routes/games");
var customersRoute = require("./routes/customers");
var rentalsRoute = require("./routes/rentals");

var app = express();

/*=======================================================================
// Setup view engine.
=======================================================================*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static("public"));

/*=======================================================================
// Enable Logger, BodyParser, CookieParser, and accept static files
// from the public folder.
=======================================================================*/
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static("public"));

/*=======================================================================
// Define routes.
=======================================================================*/
app.use("/", index);
app.use("/games", gamesRoute);
app.use("/customers", customersRoute);
app.use("/rentals", rentalsRoute);

/*=======================================================================
// Error handler.
=======================================================================*/
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

module.exports = app;
