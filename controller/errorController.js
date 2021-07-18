const appError = require('../utils/appError');



const handleDuplicateFields = (err) => {

    const message = `${err.keyValue.name} چنین اطلاعاتی قبلا ثبت شده است`;
    return new appError(message, 400);
}



//development errors ==> response with full detailed error///////////////////
const sendErrorDev = (err,req,res) => {
    // error result on postman
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            name:err.name,
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        })
    }else{
        // error result rendering
        res.status(err.statusCode).json({
            name:err.name,
            message:err.message
        })
    }
    
}

//production errors ==> response with error and message///////////////////////
const sendErrorProd = (err,req,res) => {
    // if error is operational 
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // if error is non-operational 
    return res.status(500).json({
        status: 'error',
        message: 'somthing went wrong',
      });
}

// based on appError class and the errors that would occuer server should response an error
module.exports = (err,req,res,next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    
    //checking the environment ==> development or production

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err,req,res);
        

    }else{
        if (err.code === 11000) {
            err = handleDuplicateFields(err);
        }

        sendErrorProd(err,req,res);
    }
}