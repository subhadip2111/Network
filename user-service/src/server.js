const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet=require('helmet')
require('dotenv').config();
const {RateLimiterRedis}=require('rate-limiter-flexible')
const Redis=require('ioredis')
const userRoute=require('./Routes/userRoute');
const cors=require('cors');
const logger = require('./Utils/logger');
const {rateLimit}=require('express-rate-limit')
const {RedisStore}=require('rate-limit-redis')
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

const redisClient=new Redis(process.env.REDIS_HOST)


const reateLimiter=new RateLimiterRedis({
    storeClient:redisClient,
    keyPrefix:'middleware',
    points:10,
    duration:1
})

app.use((req,res,next)=>{
    reateLimiter.consume(req.ip).then(()=>next()).catch(()=>{
logger.warn(`ratelimit  extended for this Ip${req.ip}`)    
        res.status(429).send({message:"Too many requests"})
    })

})

//IP BASED RATE LIMITING
const endpointsRateLimit=rateLimit({
    windowMs:15*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
    handler:(req,res,)=>{
        logger.warn(`Sensitive end points rateLimit excided for this Ip ${req.ip}`)
        res.status(429).send({message:`Too many requests `})
    },
    store:new RedisStore(
        {
            sendCommand:(...args)=>redisClient.call(...args)
        }
    )
   
})
app.use(endpointsRateLimit)
app.use(userRoute);

app.listen(process.env.USER_SERVICE_PORT,()=>{
    logger.info(`user service running on port ${process.env.USER_SERVICE_PORT}`);
})

process.on('unhandledRejection',(reason,Promise)=>{
    logger.error('unhandled rejection',Promise,"reason",reason)
})