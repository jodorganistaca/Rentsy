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

router.get("/schedule", async function(req, res) {
  let parms = {
    title: "Schedule",
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
  res.render("schedule",parms);
});

router.get("/add", async function(req, res) {
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  if (accessToken && userName) {
    var mu = db();
    mu.dbName("rentsy");
    mu.connect()
      .then(client => mu.getObjects(client, "objects"))
      .then(docs => {
        console.log("Return objects: ", docs);
        res.render("addObject", {
          "objects": docs,
          title: "Arrendar",
          userName: userName,
          accessToken: accessToken,
          canvasWallpaper: true,
          searchQuery: ["Calculadora", "Texas"]
        });
      });
  } else {
    res.redirect("/");
  }
  
});

router.post("/",function(req,res){
  if(req.files){
    var file = req.files.filename,
      filename = file.name;
    file.mv("./upload/"+filename,function(err){
      if(err){
        console.log(err);
        res.send("error in upload file");
      }else{
        res.send("done");
      }
    });
    console.log(filename);
  //var file = req.files.filename,
  }
});

router.post("/rent", async function(req,res){
  console.log("request bodyyyy!!",req);
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
          "objects": docs,
          title: "Arrendar",
          userName: userName,
          accessToken: accessToken,
          sidebar: true,
          canvasWallpaper: true,
          searchQuery: ["Calculadora", "Texas"]
        });
      });
  } else {
    res.redirect("/");
  }
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
          "objects": docs,
          title: "Arrendar",
          userName: userName,
          accessToken: accessToken,
          sidebar: true,
          canvasWallpaper: true,
          searchQuery: ["Calculadora", "Texas"]
        });
      });
  } else {
    res.redirect("/");
  }
});
module.exports = router;