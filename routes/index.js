var express = require("express");
var router = express.Router();
var authHelper = require("../helpers/auth");
var db = require("../db/MongoUtils");

/* GET home page. */
router.get("/", async function (req, res, next) {
  let parms = {
    title: "Home",
    active: {
      home: true
    }
  };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  const userEmail = req.cookies.graph_user_email;

  if (accessToken && userName) {
    parms.accessToken = accessToken;
    parms.userName = userName;
    parms.userEmail = userEmail;
    parms.userToken = accessToken;
  } else {
    parms.signInUrl = authHelper.getAuthUrl();
    parms.debug = parms.signInUrl;
  }

  res.render("index", parms);
});

router.get("/rent", async function (req, res) {

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  if (accessToken && userName) {
    var mu = db();
    mu.dbName("rentsy");
    mu.connect()
      .then(client => mu.getObjects(client, "objects"))
      .then(docs => {
        console.log("Return objects: ", docs);
        res.render("rent", {
          "objects": docs
        });
      });
  } else {
    res.redirect("/");
  }
});
module.exports = router;