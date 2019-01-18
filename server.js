'use strict';

var express = require('express');
var cors = require('cors');
var os = require('os');
var multer =require('multer');

var destination = os.tmpdir();  // returns string specifying operating system's temporary directory

var storage = multer.diskStorage({
  
destination: (req, file, cb)=>{
  cb(null, destination)
}, 
filename:(req, file, cb)=>{
  cb(null, file.fieldname + '-'+ Date.now())
}
});

var upload = multer({storage: storage});

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res)=>{
  // console.log(fs.readdirSync(os.tmpdir()));
  // console.log(os.tmpdir());
//  console.log(fs.readdirSync(destination))
  console.log(req.file)
   res.send({name: req.file.filename, type: req.file.mimetype, size: req.file.size});
});
