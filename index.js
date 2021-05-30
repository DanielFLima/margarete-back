const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const routes = require('./routes/routes')

mongoose.connect('mongodb://localhost/margareteDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
},()=>{    
    console.log('connected to the database')
})


app = express()

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
  /*  res.setHeader('Access-control-Allow-Methods','GET','POST','DELETE');
    res.setHeader('Access-control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-control-Allow-Credentials', true);*/
    next();
})

app.use(cookieParser())

app.use(cors({
    credentials:true,
    origin:['http://localhost:8101/']
}))

app.use(express.json())

app.use('/api', routes)

app.listen(3030)