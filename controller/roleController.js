const Role = require("../model/authorizationRelatedModel/roleModel");
const factory = require("./factory/crmFunctionFactory");

exports.getAllRole = factory.getAll(Role,{identifier:"role"});
exports.createOneRole = factory.createOne(Role,{identifier:"role"});
exports.getOneRole = factory.getOne(Role,{id:"roleId"},{path:"realtors"});
exports.updateOneRole = factory.updateOne(Role,{id:"roleId"});
exports.deleteOneRole = factory.deleteOne(Role,{id:"roleId"});