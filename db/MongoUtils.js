const MongoClient = require("mongodb").MongoClient;

function MongoUtils() {
  const mu = {};

  let hostname = "localhost",
    port = 27017,
    dbName = "rentsy";

  mu.dbName = _ => (_ !== undefined ? ((dbName = _), mu) : dbName);
  mu.hostname = _ => (_ !== undefined ? ((hostname = _),mu) : hostname);
  mu.port = _ => (_ !== undefined ? ((port = _),mu) : port);

  mu.connect = () =>{
    const url = `mongodb://${hostname}:${port}/${dbName}`;
    
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

    console.log("connecting");
    return new Promise((resolve, reject) => {
      client.connect((err) => {
        if(err){
          reject && reject(err);
          return;
        }
      
        console.log("Connected!");
        resolve(client);
      });
    });
    
  };

  mu.getObjects = (client, collectionName) => {
    if (!client || !collectionName)
    {
      console.error("ERROR: Empty arguments! at: MongoUtils -> mu.getObjects(" + client + "," + collectionName +")");
      return;
    }
    const objects = client.db(dbName).collection(collectionName);

    console.log("Querying objects");
    return objects.find({}).toArray().finally(() => client.close());
  }; 

  mu.findByName = (client, collectionName, name) => {
    if (!client || !collectionName)
    {
      console.error("ERROR: Empty arguments! at: MongoUtils -> mu.getObjects(" + client + "," + collectionName +")");
      return;
    }
    const objects = client.db(dbName).collection(collectionName);

    console.log("Querying objects by name");
    return objects.find({ $text: { $search: name } }).toArray().finally(() => client.close());
  }; 

  mu.insertOneObject = (object, client, collectionName) => {
    if (!client || !client.db || !object || !collectionName)
    { 
      console.error("ERROR: Empty arguments! at: MongoUtils -> mu.insertOneObject(" + object + "," + client +  ", " + collectionName +")");
      return;
    }
    const objects = client.db(dbName).collection(collectionName);
    objects.createIndex( { name: "text" } );
    return objects.insertOne(object, (err, result) => {
      if(err){
        console.log(err);
      }else{
        console.log(result);
      }
      client.close();
    });
  };

  mu.dropCollection = (client, collectionName) => 
  {
    client.db(dbName).collection(collectionName).drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection: " +collectionName + " deleted");
      client.close();
    });
  };

  mu.findByOwner = (client, collectionName, Name) => {
    const object = client.db(dbName).collection(collectionName);
    return object.find({ arrendador: {userName: Name} }).toArray().finally(() => client.close());
  };

  mu.findByEmailOwner = (client, collectionName, Email) => {
    const object = client.db(dbName).collection(collectionName);
    return object.find({ arrendador: {email: Email} }).toArray().finally(() => client.close());
  };

  return mu;
}


const mu = MongoUtils();

var objetoPrueba = {

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


};

var idCollectionInit =     {
  "_id" : "item_id",
  "sequence_value": 0
};

/*
mu.connect()
  .then(client => mu.dropCollection(client, "objects"))
  .catch((err) => console.log(err));


mu.connect()
  .then(client => mu.dropCollection(client, "idCollection"))
  .catch((err) => console.log(err));

mu.connect()
  .then(client => mu.dropCollection(client, "objects"))
  .catch((err) => console.log(err)); */

/*
mu.connect()
  .then(client => mu.getObjects(client, "idCollection"))
  .then(docs => {
    console.log("Return idCollection collection: ", docs);
  })
  .catch((err) => console.log(err));*/

/*
mu.connect()
  .then((client) => mu.insertOneObject(objetoPrueba, client, "objects"))
  .catch((err) => console.log(err));

mu.connect()
  .then(client => mu.getObjects(client, "objects"))
  .then(docs => {
    console.log("Return objects: ", docs);
  })
  .catch((err) => console.log(err));*/


module.exports = MongoUtils;