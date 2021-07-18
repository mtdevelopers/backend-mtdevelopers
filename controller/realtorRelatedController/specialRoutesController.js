

exports.bestSeller = (req,res,next) => {
    req.query.limit = 10;
    req.query.sort = "sellCompletion"
    next();
}