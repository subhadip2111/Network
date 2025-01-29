const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet=require('helmet')
require('dotenv').config();
const userRoute=require('./Routes/userRoute');
const cors=require('cors');
const logger = require('./Utils/logger');
const companyRouter = require('./Routes/company.Route');
const hiringComoanyRouter = require('./Routes/hiring.postRoute');
const feedRouter = require('./Routes/feedRoute');

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet())
app.use(cors())

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    
}).then(()=>{
    logger.info("Connected to Mongodb");
}).catch((err)=>{
    console.log(err);
})

app.use(userRoute);
app.use(companyRouter)
app.use(hiringComoanyRouter)
app.use(feedRouter)
app.get('/',(req,res)=>{
    return res.status(200).send({message:"Hello World"})
})
app.listen(process.env.USER_SERVICE_PORT,()=>{
    logger.info(`user service running on port ${process.env.USER_SERVICE_PORT}`);
    })

process.on('unhandledRejection',(reason,Promise)=>{
    logger.error('unhandled rejection',Promise,"reason",reason)
})