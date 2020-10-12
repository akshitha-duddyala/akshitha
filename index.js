var express= require('express');
var app=express();
const MongoClient=require('mongodb').MongoClient;
//connecting server file for awt
let server=require('./server');
//let config=require('./config');
let middleware=require('./middleware');
//const reponse=require('express');
//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Database connection
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalmanagement';
let db
MongoClient.connect(url,{ useUnifiedTopology: true }, (err, client) => {
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
//get hospital details
app.get('/hospitaldetails', middleware.checkToken,function(req, res) {
    console.log("hospitaldetails") ;
    var data=db.collection('hospitaldetails').find().toArray().then(result=>res.json(result));
});

//get ventilator details
 app.get('/ventilatordetails', middleware.checkToken,function(req, res) {
    console.log("ventilatordetails") ;
    var data=db.collection('ventilatordetails').find().toArray().then(result=>res.json(result));
 });

 //search ventilatordetails by status
 app.post('/searchventbydetails', middleware.checkToken,(req, res) => {
     var status=req.body.status;
     console.log(status);
     var ventilatordetails=db.collection('ventilatordetails') .find({"status":status}).toArray().then(result=>res.json(result));
    // res.send(ventilatordetails)
 });

 //search ventilator details by hospital name
 app.post('/searchventbyname', middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilatordetails')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//get hospital details by name
app.post('/searchhospital', middleware.checkToken, (req, res) => {
    const name = req.query.name;
    console.log(name);
    const ventilatordeatils = db.collection('hospitaldetails')
        .find({ 'name': new RegExp(name, 'i') }).toArray().then(result => res.json(result));
});

//add ventilator
app.post('/addventilator', middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var ventilatorid=req.body.ventilatorid;
    var status=req.body.status;
    var name=req.body.name;
    var item={hid:hid,ventilatorid:ventilatorid,status:status,name:name};
    db.collection('ventilatordetails')
    .insertOne(item).then(result=>res.json("Item inserted"));
});

//delete ventilator
app.delete('/deleteventilator', middleware.checkToken,(req,res)=>{
    var ventilatorid=req.body.ventilatorid;
    db.collection('ventilatordetails')
    .deleteOne({"ventilatorid":ventilatorid}).then(result=>res.json("Item deleted"));
});

//update ventilatordetails
app.put('/updateventilator', middleware.checkToken,(req, res) => {
    var ventid={ventilatorid:req.body.ventilatorid};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection('ventilatordetails')
    .updateOne(ventid,newvalues,function(err,result){
        res.json("1 document updated");
        if(err) throw err;
    });
});
app.listen(1100);