const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
//Documenten todo por favor
function MongoUtils() {
  const mu = {};

  //Muy bien que utilicen variables de entorno
  let hostname = "localhost",
    port = process.env.DB_PORT,
    dbName = process.env.DB_NAME;

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
    return objects.find({ $text: { $search: name }, events: null  }).toArray().finally(() => client.close());
  }; 

  mu.insertOneObject = (object, client, collectionName) => {
    if (!client || !client.db || !object || !collectionName)
    { 
      console.error("ERROR: Empty arguments! at: MongoUtils -> mu.insertOneObject(" + object + "," + client +  ", " + collectionName +")");
      return;
    }
    const objects = client.db(dbName).collection(collectionName);
    console.log("object to insert", object);
    console.log("LLegue");
    objects.createIndex( { name: "text" } );
    return objects.insertOne(object, (err, result) => {
      if(err){
        //console.log(err);
      }else{
        //console.log(result);
      }
      client.close();
    });
  };

  //No muestren errores por consola, si quieren hacer eso mejor creen un log file
  mu.updateOneObject = (client, collectionName, Id, object) => {
    if (!client || !client.db || !object || !collectionName)
    { 
      
      return;
    }
    const objects = client.db(dbName).collection(collectionName);
    return objects.findOneAndUpdate({ "_id": new ObjectId(Id)}, { $set: object});
  };

  mu.pushOneObject = (client, collectionName, Id, object) => {
    if (!client || !client.db || !object || !collectionName)
    { 
     
      return;
    }
    const objects = client.db(dbName).collection(collectionName);
    return objects.findOneAndUpdate({ "_id": new ObjectId(Id)}, object);
  };

  mu.deleteOneObject = (client, collectionName, Id) => {
    if (!client || !client.db || !collectionName)
    { 
    
      return;
    }
    const objects = client.db(dbName).collection(collectionName);
    return objects.findOneAndDelete({ "_id": new ObjectId(Id)});
  };

  mu.dropCollection = (client, collectionName) => 
  {
    client.db(dbName).collection(collectionName).drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) 
      client.close();
    });
  };

  mu.findByOwner = async (client, collectionName, Email) => {
    const object = client.db(dbName).collection(collectionName);
    return  object.find({ "arrendatario.email": Email  }).toArray();
  };

  mu.findByObjectId =  async (client, collectionName, Id) => {
    const object = client.db(dbName).collection(collectionName);
    return object.find({ "_id": new ObjectId(Id)}).toArray();
  };

  // No entiendo aun por qué usan async sin await
  mu.findByRenter = async (client, collectionName, Email) => {
    const object = client.db(dbName).collection(collectionName);
    return object.find({ "arrendador.email": Email  }).toArray();
  };

  return mu;
}
   
module.exports = MongoUtils;
