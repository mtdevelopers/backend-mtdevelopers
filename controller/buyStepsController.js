const factory = require("./factory/crmFunctionFactory");
const BuySteps = require("../model/propertyModel/buystepsModel");

exports.getAllBuySteps = factory.getAll(BuySteps,{identifier:"buystepsId"},{path:"requests", select:"code"});
exports.getOneBuySteps = factory.getOne(BuySteps,{identifier:"buystepsId"});
exports.createOneBuySteps = factory.createOne(BuySteps,{id:"buystepsId"});
exports.updateOneBuySteps = factory.updateOne(BuySteps,{id:"buystepsId"});
exports.deleteOneBuySteps = factory.deleteOne(BuySteps,{id:"buystepsId"});
