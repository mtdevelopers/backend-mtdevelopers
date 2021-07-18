const CustomerType = require("../../model/propertyModel/customerTypeModel");
const factory = require("../factory/crmFunctionFactory");



exports.getAllCustomerType = factory.getAll(CustomerType,{identifier:"customerType"},{path:"requests", select:"code"});
exports.createOneCustomerType = factory.createOne(CustomerType,{identifier:"customerType"});


exports.getOneCustomerType = factory.getOne(CustomerType,{id:"customerTypeId"});
exports.updateOneCustomerType = factory.updateOne(CustomerType,{id:"customerTypeId"});
exports.deleteOneCustomerType = factory.deleteOne(CustomerType,{id:"customerTypeId"});