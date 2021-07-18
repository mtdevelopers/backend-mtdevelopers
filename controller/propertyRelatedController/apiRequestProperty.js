const RequsetProperty = require("../../model/propertyModel/requestPropertyModel");
const factory = require("../factory/functionFactory");
// const catchAsync = require("../../utils/catchAsync");


exports.getMyRequests = (req,res,next) => {
    req.query.createdByCustomer = req.user._id;
    next();
}

// this get all function will not populate customers
exports.getAllRequestProperty = factory.getAll(RequsetProperty,{identifier:"requestedProperty"});
exports.createOneRequestProperty = factory.createOne(RequsetProperty,{identifier:"requestedProperty"});
exports.getOneRequestProperty =  factory.getOne(RequsetProperty,{id:"requestpropertyId"});
exports.updateOneRequestProperty = factory.updateOne(RequsetProperty,{identifier:"requestedProperty",id:"requestpropertyId"});
exports.deleteOneRequestProperty = factory.deleteOne(RequsetProperty,{identifier:"requestedProperty",id:"requestpropertyId"});




