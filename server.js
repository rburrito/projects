const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const shortid = require('shortid')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)

const schema = mongoose.Schema({
username: String, 
userId: String,
count: Number,
log:[{description:String, duration: Number, date: Date}]
});

let User = mongoose.model("User", schema)

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
/*
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
}) */

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

app.post('/api/exercise/new-user',(req,res)=>{
  User.find({username: req.body.username}, (err, result)=>{
    if (err){
      console.log("Error: "+ err)
      return
    } 
    
    else if (result.length==0){       // 
      console.log("Username not in use: "+result)
      let userid = shortid.generate();
      let user = new User({username: req.body.username, userId: userid})
      user.save((err, object)=>{
      if (err){
        console.log("Save error: "+ err);
        res.status(400).send("username already taken")
        return
      } 
      console.log("Save username: "+ object)
      res.status(200).send({username: object.username, _id: object.userId})
      })
    } 
    
    else {
      console.log(result[0].username + " is taken")
      res.status(400).send("username already taken")
    } 
    
  })
})


let addDigit=(number)=>{
if (number<10){
number="0"+number
}
return number
}

  
app.post('/api/exercise/add', (req, res)=>{
  let date;
  let completeDate=""
  let year
  let month
  let day
  if (req.body.date){
  completeDate = req.body.date
  } else {
  date = new Date();
  year = date.getFullYear()
  month = date.getMonth()+1
  month = addDigit(month)
  day = date.getDate()
  day = addDigit(day)
  completeDate = year+"-"+month+"-"+day
    console.log(completeDate)
  }
  

  User.findOneAndUpdate({userId:req.body.userId},{$push:{log:{description: req.body.description, duration: req.body.duration, date: completeDate}}}, (err, result)=>{
  if (err){
  console.log(err)
   return;
  }
    console.log("added exercise: "+result)
   res.status(200).send({username: result.username, description: req.body.description, duration: req.body.duration, _id: req.body.userId, date: completeDate})
  })

  })

let shouldPush = (fDate, tDate, date)=>{
let yesToPush =true  // 1 to push

if (fDate && date.valueOf()<fDate.valueOf()){
  yesToPush = false
} 

  if (tDate && date.valueOf()>tDate.valueOf()){
  yesToPush = false
  }
  
  return yesToPush
}


let getLog= (fDate, tDate, log, limit)=>{
  let dateLog = []
  let fromDate = new Date(fDate)
  let toDate = new Date(tDate)
  let newLimit = limit || log.length  // if limit is not specified
      for(let i=0; i < log.length && dateLog.length < newLimit; i++){
       if (shouldPush(fromDate,toDate, log[i].date)){
       dateLog.push(log[i])
       }
      }
    return dateLog
  }  // getLog function
 
  app.get('/api/exercise/log', (req, res)=>{
    User.findOne({userId: req.query.userId}, (err, product)=>{
    if (err){
    console.log("Error "+ err)
      return
    } else if (product!=null){
    console.log(product)
    let mainLog= getLog(req.query.from, req.query.to, product.log, req.query.limit)
    console.log(mainLog)
    res.status(200).send({_id: product.userId, username: product.username, count:mainLog.length, log: mainLog})
          
      
    } else {
    res.status(404).send("unknown user Id")
    }  
    })
  })


app.get('/api/exercise/users', (req, res)=>{
  let users = User.find()
  users.sort({username:"asc"}).exec((err,result)=>{
  if (err){
  console.log(err)
  return
  }
    else if (result.length!=0){
      console.log(result)
       const usernameArray = result.map((res) => {
         return {_id: res.userId, username: res.username, __v: res.__v}
       })
    res.status(200).send(usernameArray)
     
    } else {
    res.status(404).send("no users")
    }
  })
})
