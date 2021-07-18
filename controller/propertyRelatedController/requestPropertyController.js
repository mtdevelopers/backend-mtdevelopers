const RequsetProperty = require("../../model/propertyModel/requestPropertyModel");
const factory = require("../factory/crmFunctionFactory");
// const catchAsync = require("../../utils/catchAsync");



// this get all function will not populate customers
exports.getAllRequestProperty = factory.getAll(RequsetProperty,{identifier:"requestedProperty"});
exports.createOneRequestProperty = factory.createOne(RequsetProperty,{identifier:"requestedProperty"});
exports.getOneRequestProperty =  factory.getOne(RequsetProperty,{id:"requestpropertyId"});
exports.updateOneRequestProperty = factory.updateOne(RequsetProperty,{identifier:"requestedProperty",id:"requestpropertyId"});
exports.deleteOneRequestProperty = factory.deleteOne(RequsetProperty,{identifier:"requestedProperty",id:"requestpropertyId"});
// in 3 url s we just populate the customers info 
exports.getAllRequestPropertyByPopulate = factory.getAllWithPopulate(RequsetProperty,{path:"customer" , select:"mobileNumber firstName lastName"});
// refrencedToMe confirmedByMe addedByMe






exports.waitForConfirm = (req,res,next) => {

    const queryStr = {$or:[{status:"addedByCustomer"},{$and:[{status:"inProgressByRealtor"},{inprogressedByRealtor:req.realtor._id}]}]}
    req.query = {...req.query,...queryStr};
    next();
}

exports.myRequestProperty = (req,res,next) => {
    const querytring = {
        $or: [
            {createdByRealtor : req.realtor._id},// created by me
            {confirmedByRealtor : req.realtor._id},// customer added and i confirmed it
            {refrenceToRealtor :{ $in: [req.realtor._id]}}, // refrenced to me
            
        ]
    };
    req.query = { ...req.query, ...querytring};
    
    next();
}
exports.refrencedToMe = (req,res,next) => {
    req.query.refrenceToRealtor = {$in:[req.realtor._id]}; //just refrenced to me
    next();
}

exports.confirmedRequestProperty = (req,res,next) => {
    req.query.status = "confirmedByRealtor"; //just refrenced to me
    next();
}