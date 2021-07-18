// errors are operational or developer errors

// operational errors for example:
        // failed to connect to server
        // failed to resolve hostname
        // invalid user input
        // request timeout
        // server returned a 500 response
        // socket hang-up
        // system is out of memory
class appError extends Error{
    // all kind of errors contains httpCode, status, message 
    // status is fail for 4 base error(404) and is error for 5 base error (500)
    constructor(httpCode,message){
        super(message);
        this.httpCode = httpCode;
        this.status = `${httpCode}`.startsWith("4") ? 'fail' : "error";
        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = appError;