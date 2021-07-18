const Workplace = require("../../model/workplaceModel");
const factory = require("../factory/crmFunctionFactory");

//list all workplace
exports.getAllWorkplace = factory.getAll(Workplace,{identifier:"workplace"});

//create a workplace
exports.createWorkplace = factory.createOne(Workplace,{identifier:"workplace"});

//get one workplace
exports.getOneWorkplace = factory.getOne(Workplace,{id:"workplaceId"});
exports.updateOneWorkPlace = factory.updateOne(Workplace,{id:"workplaceId"});
//delete one workplace
exports.deleteOneWorkplace = factory.deleteOne(Workplace,{id:"workplaceId"});