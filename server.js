'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {autoindex:false});
var bodyParser = require('body-parser');
var dns = require('dns');
var urlParser = require('url');
var options = {
};

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
var baseURL = "https://cat-minute.glitch.me";
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));



/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

var Schema = mongoose.Schema;
var urlSchema = new Schema({
 url: String,
 shorturl: Number
});

var URL = mongoose.model("URL",urlSchema);

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

var shortURL;

app.post('/api/shorturl/new',(req, res)=>{
  // url findOne() for slicedURL, if successful, send response "url already exists in database"
  options.all=true;
  var parsedURL=urlParser.parse(req.body.url, true, false).hostname;
  console.log("parsedURL: "+ parsedURL);
  dns.lookup(parsedURL, (err,address)=>{
  if (err) {
    console.log(err);
    res.status(404).json({"error":"invalid URL"});
    return;
   } 
    console.log("DNS success");
    URL.findOne({url: req.body.url}, (err, sliced)=>{
    if (sliced){
      console.log("foundOne");
    res.send({"original_url": sliced.url, "shorturl": sliced.shorturl});
      return;
    }
     
    var code =URL.find();
    var urlCodeResult = code.sort({shorturl:"desc"}).limit(1).exec((err, result)=>{
      if (err){
        console.log("sort error!");
        return;
      }
      else if(result.length!=0){
        console.log("sorted");
        shortURL = new URL({url:req.body.url, shorturl:result[0].shorturl+1});
      } 
      else {
        let urlCounter=1;
        shortURL=new URL({url: req.body.url, shorturl: urlCounter});       
      } 
      
      shortURL.save((err, product)=>{
        if (err){
          console.log("save: "+ err);
        }
        console.log("Product :"+product);
        res.status(200).send({original_url: req.body.url, shorturl:product.shorturl});
      });
      
     });   // code.sort
  
    });  // findOne()  
    
});  // dns lookup()
});


/*
let findRedirectURL=(shortenedURLCount, done)=>{
  URL.findOne({shorturl: shortenedURLCount}, (err, shorturl)=>{
    if (err){
      return err;
    } 
    //console.log(shorturl);
    done(shorturl);
  });
}; */



app.get('/api/shorturl/:urlCount', (req,res)=>{
 // console.log(req.params.urlCount);
/*findRedirectURL(req.params.urlCount, (shorturl)=>{
res.redirect(shorturl.url); */
  URL.findOne({"shorturl": req.params.urlCount}, (err, shorturl)=>{
    if (err){
      console.log("error :"+ err);
      res.status(404).send({error:"invalid url"});
      return;
    } else if (shorturl){
    console.log("success: "+shorturl);
    res.redirect(shorturl.url);
    } else {
    res.status(404).send({error: "invalid url"});
    }
  });

});







/*if (requestURL){
app.get(requestURL,(req,res)=>{
  res.redirect(redirectURL);
}); 
} */