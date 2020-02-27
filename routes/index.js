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

  parms.myObjects = [{
    id: 1,
    name: "Calculadora Texas",
    description: "Arriendo calculadora texas",
    priceHour: "$2000/hora",
    priceDay: "$5000/día",
    arrendador: {
      userName: "Juan Sebastián Bravo",
      email: "js.bravo@uniandes.edu.co"},
    usuariosInteresados: ["js.bravo@uniandes.edu.co"],
    events:[{
      start: new Date(),
      end: new Date(),
      /* https://fullcalendar.io/docs/recurring-events 
    duration: */
      title: "Calculadora",
      state: "Arrendado",
      usuarioArrendatario: "js.bravo@uniandes.edu.co",
      esRecurrente: true,
      daysOfWeek:[0,1,2,3,4],
      startRecur: new Date(),
      endRecur: new Date(),
      /* hh:mm:sss */
      startTime: "09:20",
      endTime: "09:20"}]
  
  
  }];
  parms.rentedObjects = [{name:"No Texas"}, {name:"No Texas 2 "}, {name:"No Texas 3"}];

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

router.post("/addObject",function(req,res){
  if(req.files){
    var file = req.files.filename,
      filename = file.name;
    file.mv("./upload/"+filename,function(err){
      if(err){
        console.log(err);
        res.send("error in upload file");
      }else{
        console.log("request bodyyyy!!",req);
        var objetoPrueba = {
          name: req.body.name,
          description: req.body.description,
          priceHour: req.body.priceHour,
          priceDay: req.body.priceDay,
          arrendador: {
            userName: "Juan Sebastián Bravo",
            email: "js.bravo@uniandes.edu.co"},
          usuariosInteresados: ["js.bravo@uniandes.edu.co"],
          events:[{
            start: new Date(),
            end: new Date(),
            /* https://fullcalendar.io/docs/recurring-events 
          duration: */
            title: "Calculadora",
            state: "Arrendado",
            usuarioArrendatario: "js.bravo@uniandes.edu.co",
            esRecurrente: true,
            daysOfWeek:[0,1,2,3,4],
            startRecur: new Date(),
            endRecur: new Date(),
            /* hh:mm:sss */
            startTime: "09:20",
            endTime: "09:20"}]
        };
        var mu = db();
        mu.dbName("rentsy");
        mu.connect()
          .then(client => mu.insertOneObject(objetoPrueba,client, "objects"))
          .then(docs => {
            console.log("Return objects: ", docs);
            res.send("done");
          });        
      }
    });
    console.log(filename);
  //var file = req.files.filename,
  }
});

router.post("/rent", async function(req,res){
  console.log("request bodyyyy!!",req);
  console.log("nameeee: ", req.body.objeto);
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