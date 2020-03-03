// Recuerden que la nueva norma RECOMIENDA no usar var sino let y const
const express = require("express");
const router = express.Router();
const authHelper = require("../helpers/auth");
const db = require("../db/MongoUtils");
const upload = require("../db/upload");


/**
* No entiendo para que utilizan async sin un await dentro de la función, yo lo quitaría
*/
/* GET home page. */
router.get("/", async function (req, res) {
  let parms = {
    title: "Home",
    active: {
      home: true
    },
    home: true
  };
  
  //Documenten todo lo que hagan

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

//Lo mismo de arriba

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
//No usen var
  const updatedObject = {
    description: req.body.description,
    priceHour: req.body.priceHour,
    priceDay: req.body.priceDay,
  };
  const mu = db();
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
    //Quiten los console 
    console.log(req.body);
    // Define a JSONobject for the image attributes for saving to database
    var nameFile = `${Date.now()}-${req.files.file.name}`;
    var finalImg = {
      name: nameFile,
      contentType: req.files.file.mimetype,
      base64:  new Buffer(req.files.file.data).toString("base64")
    };
  //No usen var
    const objetoPrueba = {
      name: req.body.name,
      description: req.body.description,
      priceHour: req.body.priceHour,
      priceDay: req.body.priceDay,
      arrendador: {
        userName: req.cookies.graph_user_name,
        email: req.cookies.graph_user_email
      },
      image: finalImg
    };
    const mu = db();
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

router.post("/rent/:id", async function(req,res){
//No coloquen los console.log() en la versión final del repositorio
  let start = JSON.parse(req.query.start);
  console.log(start);
  let end = JSON.parse(req.query.end);
  console.log(end);
  let daysOfWeek = JSON.parse(req.query.daysOfWeek);
  console.log(daysOfWeek);
  let startRecur = req.query.startRecur;
  console.log(startRecur);
  let endRecur = req.query.endRecur;
  console.log(endRecur);
  let title = req.query.title;
  const userName = req.cookies.graph_user_name;
  const userEmail = req.cookies.graph_user_email;
  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  var updatedObject = {};
  if (startRecur != "")
  {
    updatedObject["$set"] =  {arrendatario: userEmail};
    updatedObject["$push"] = {  "events": 
                      { "startRecur": startRecur,
                        "endRecur": endRecur,
                        "daysOfWeek": daysOfWeek,
                        "title": title
                       
                      }};
      
  }
  else
  {
    updatedObject["$set"] =  {arrendador: userEmail};
    updatedObject["$push"] = {  "events": 
                      { "start": start,
                        "end": end,
                        "daysOfWeek": daysOfWeek,
                        "title": title,
                        "allDay": true
                       
                      }};
  }
  console.log(updatedObject);
  if (accessToken && userName) {
    var mu = db();
    mu.dbName("rentsy");
    mu.connect()
      .then(client => mu.pushOneObject(client, "objects", req.params.id, updatedObject))
      .then(
        res.redirect("/"));
        
    
  
  } else {
    res.redirect("/");
  }
});

router.post("/rent", async function (req, res) { 

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;
  if (accessToken && userName) {
    var mu = db();
    mu.dbName("rentsy");
    mu.connect()
      .then(client => mu.getObjects(client, "objects"))
      .then(docs => {
        //console.log("Return objects: ", docs);
        res.render("rent", {
          "objects": docs,
          title: "Arrendar",
          userName: userName,
          accessToken: accessToken,
          sidebar: true,
          canvasWallpaper: true
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
        //console.log("Return objects: ", docs);
        res.render("rent", {
          "objects": docs,
          title: "Arrendar",
          userName: userName,
          accessToken: accessToken,
          sidebar: true,
          canvasWallpaper: true
        });
      });
  } else {
    res.redirect("/");
  }
});
module.exports = router;
