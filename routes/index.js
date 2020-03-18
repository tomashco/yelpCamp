var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req,res) => {
  res.render("landing");
});

//SHOW
router.get("/register", (req,res) => {
  res.render("register");
});

//handle signup logic
router.post("/register", (req,res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
     req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", `Welcome to YelpCamp ${req.body.username}!`);
      res.redirect("/campgrounds");
    });
  });
});

router.get("/login", (req,res) => {
  res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req,res) => {
});

//logout route
router.get("/logout", (req,res) => {
  req.logOut();
  req.flash("success","Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
