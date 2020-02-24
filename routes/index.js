var express = require("express");
var router = express.Router();
var authHelper = require("../helpers/auth");

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

router.get("/schedule", function(req, res) {
  res.render("schedule");
});
module.exports = router;