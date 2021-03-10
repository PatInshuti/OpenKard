const express = require('express');
const uuid = require('node-uuid');
const app = express()
const path = require('path'); 
const cors = require('cors')
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017";
const dbName = "openCard-v1";
const port = 6800;


MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  
  if (err) {
      return console.log(err);
  }


  // Specify database you want to access
  const db = client.db(dbName);
  const cardsCollection = db.collection('cards');

  app.use(cors())
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.use(bodyParser.json({limit: '50mb', extended: true}));


  //*** Begin Routes ***//
  app.all((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:6800");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    next();
  })
    

  app.post('/api/v1/publish', (req, res) => {

    if (req.body.Front || req.body.Back){

        const editUrl = uuid.v4();
        const viewUrl = uuid.v4();

        // Save the front and back of the card to database
        cardsCollection.insertOne({ "Front":req.body.Front, "Back":req.body.Back, editUrl:editUrl, viewUrl:viewUrl, frontColor: req.body.frontColor, backColor: req.body.backColor },(err,res)=>{
          if (err) throw err;
        });

        res.json({ status:200, "editUrl":editUrl, "viewUrl":viewUrl });
    }

    else{
        res.json({response:400})
      }
  })


  app.get("/api/v1/url/:urlId",(req,res)=>{
    const urlId = req.params.urlId;    
    cardsCollection.findOne({viewUrl:urlId},(err,card)=>{

      if (card) {

        let data = {}
        data["Front"] = card.Front
        data["Back"] = card.Back
        data["frontColor"] = card.frontColor
        data["backColor"] = card.backColor
        res.json({ status:200, data:data })
      
      }

      else{
        res.json({ status:400 })
      }

    })

  })

  // Handle React routing, return all requests to React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  app.listen(port, () => {
    console.log(`OpenCard server running at http://localhost:${port}`);
    console.log(`MongoDB Connected: ${uri}`);
  })
  
});



