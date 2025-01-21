const joi=require('joi');
const loginValidation=(data)=>{
    const schema=joi.object({
        phoneNumber:joi.string().required(),
    });
    return schema.validate(data);
}

module.exports={loginValidation};