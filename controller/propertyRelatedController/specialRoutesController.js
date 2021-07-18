exports.newest = (req,res,next)=>{
    req.query.limit = '8';
    req.query.sort = '-createdAt';
    next();
};

exports.lowestPrice = (req,res,next)=>{
    req.query.limit = '8';
    req.query.sort = '-price';
    next();
};


exports.highestPrice = (req,res,next)=>{
    req.query.limit = '8';
    req.query.sort = 'price';
    next();
};


// exports.newest = (req,res,next)=>{
//     req.query.limit = '8';
//     req.query.sort = '-createdAt';
//     next();
// };
