const User = require("../../model/userRelatedModels/userModel");
const factory = require("../factory/crmFunctionFactory");


/////////////////////////////////////////////////////////////////////////
// list all users => customers
exports.getAllUser = factory.getAll(User,{identifier:"user"});
exports.getOneUser = factory.getOne(User,{id:"userId"},{path:"customers"});
//create a customer
exports.createOneUser = factory.createOne(User,{identifier:"user"});
// delete a customer
exports.deleteOneUser = factory.deleteOne(User);
//update a user
exports.updateOneUser = factory.updateOne(User);