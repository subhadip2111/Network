const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const Redis = require('ioredis');
const {rateLimit}=require('express-rate-limit');
const {RedisStore}=require('rate-limit-redis');
const logger = require('./utils/logger');
const proxy=require('express-http-proxy')
app.use(express.json());
app.use(helmet());
app.use(cors());


const redisClient=new Redis(
    process.env.REDIS_HOST
)

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



app.use((req,res,next)=>{
    logger.info(`Request from ${req.ip} to ${req.url}`)
    next()
})


const proxyOptions={
    proxyReqPathResolver:(req,res)=>{
        return req.originalUrl.replace(/^\/v1\/userService/, "/user");
    },
    proxyErrHandler:(err,res,next)=>{
        logger.error(`proxy errr${err.message}`)
        return res.status(500).send({message:"Internal Server Error",error:err.message})
    }
}

app.use('/v1/userService',proxy(process.env.USER_SERVICE_URL,{
    ...proxyOptions,
    proxyReqOptDecorator:(proxyReqOpts,srcRequest)=>{
        proxyReqOpts.headers["Content-type"]="application/json"
        return proxyReqOpts
    },
    userResDecorator:(proxyRes,proxyResData,userReq,userRes)=>{
        logger.info(`response recive from user service`)
        return proxyResData

    }
}))
app.get('/',()=>{
    return res.status(200).send({message:"Hello World"})
})
app.listen(process.env.API_GATEWAY_PORT, () => {
  logger.info(`server is running on port ${process.env.API_GATEWAY_PORT}`);
});
