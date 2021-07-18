
// this function IIFE will act as try catch block
// get a ffunction that needs a try catch block
module.exports =  (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}