var express = require('express')
const session = require("express-session");
var router = express.Router()
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;



router.get("/", (req, res) => {
  console.log(req.session.passport.user);
  if(!req.isAuthenticated()){
    console.log('wtf');
    res.redirect("/login");
  } else{
      res.sendFile("/var/www/pageus.site/public_html/sources/index.html");
  }
});

module.exports = router