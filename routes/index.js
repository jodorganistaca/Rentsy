var express = require("express");
var router = express.Router();
var authHelper = require("../helpers/auth");
var db = require("../db/MongoUtils");
var upload = require("../db/upload");
var fs = require("fs");


/* GET home page. */
router.get("/", async function (req, res) {
  let parms = {
    title: "Home",
    active: {
      home: true
    },
    home: true
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
    },
    sidebar: true
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
    res.redirect("/");
  }



  var mu = db();
  mu.dbName("rentsy");
  mu.connect()
    .then(client => mu.findByRenter(client, "objects", userEmail))
    .then(docs => {
      parms.rentedObjects = docs;
    })
    .then(() => mu.connect())
    .then(client => mu.findByOwner(client, "objects", userEmail))
    .then(docs => 
    {
      parms.myObjects = docs;
      console.log(parms.myObjects);
      res.render("schedule", parms);
    });
      
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
          home: true,
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

router.post("/delete/:id", async function(req, res) {


  var mu = db();
  mu.dbName("rentsy");
  mu.connect()
    .then(client => mu.deleteOneObject(client, "objects", req.params.id))
    .then(docs => {
      console.log("Return objects: ", docs);
      res.redirect("/");
    });  
  
});

router.get("/get/:id", async function(req, res) {


  var mu = db();
  mu.dbName("rentsy");
  mu.connect()
    .then(client => mu.findByObjectId(client, "objects", req.params.id))
    .then(docs => {
      res.json(docs);
    });  
  
});

router.post("/update/:id", async function(req, res) {

  var updatedObject = {
    description: req.body.description,
    priceHour: req.body.priceHour,
    priceDay: req.body.priceDay,
  };
  var mu = db();
  mu.dbName("rentsy");
  mu.connect()
    .then(client => mu.updateOneObject(client, "objects", req.params.id, updatedObject))
    .then(docs => {
      res.json(docs);
    });  
  
});

router.post("/addObject",  async function (req, res) {
  if(req.files){
    upload.single("file");
    console.log(req.body);
    // Define a JSONobject for the image attributes for saving to database
    var nameFile = `${Date.now()}-${req.files.file.name}`;
    var finalImg = {
      name: nameFile,
      contentType: req.files.file.mimetype,
      base64:  new Buffer(req.files.file.data).toString("base64")
    };

    var objetoPrueba = {
      name: req.body.name,
      description: req.body.description,
      priceHour: req.body.priceHour,
      priceDay: req.body.priceDay,
      image: finalImg
    };
    var mu = db();
    mu.dbName("rentsy");
    mu.connect()
      .then(client => mu.insertOneObject(objetoPrueba,client, "objects"))
      .then(docs => {
        console.log("Return objects: ", docs);
        res.redirect("/");
      });    
  }else{
    res.send("algo paso");
  }  
  
});

router.post("/rent", async function(req,res){
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  if (accessToken && userName) {
    var mu = db();
    mu.dbName("rentsy");
    mu.connect()
      .then(client => mu.findByName(client, "objects", req.body.objeto))
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