const express=require('express')
const session=require('express-session')
const dbconnect = require('./config/dbConnect')
const nocache=require('nocache')
const path=require('path')
const app=express()
const dotenv=require('dotenv').config()
const morgan=require('morgan')

const PORT=process.env.PORT||8000
const userRouter=require('./routes/userRouter')
const adminRouter=require('./routes/adminRouter')
const bodyParser = require('body-parser')

//connecting all ingredients

app.set('view engine','ejs')

dbconnect()
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))

app.use(nocache())
app.use(morgan("tiny"));

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'public/assets')))

app.use(bodyParser.urlencoded({extended:false}))

//---------------------- Set the routers for user and admin ------------------------------------------------------
app.use('/',userRouter)
app.use('/admin',adminRouter)


app.listen(PORT,()=>console.log(`Server starts in http://localhost:${PORT}`))