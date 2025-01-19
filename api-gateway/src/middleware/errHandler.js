const logger = require('../Utils/logger');

const errhandler=(err,req,res,next)=>{
    logger.error(err.stack);
    res.status( err.status|| 500).json({
        message:err.message || 'Something went wrong'
    })
    
}
module.exports=errhandler;