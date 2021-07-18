const Area = require("../../model/areaModel");
const factory = require("../factory/crmFunctionFactory");

//list all area
exports.getAllArea = factory.getAll(Area,{identifier:"area"});
//create area\
exports.createArea = factory.createOne(Area,{identifier:"area"});
//get one area
exports.getOneArea = factory.getOne(Area,{id:"areaId"});
//update one area
exports.updateOneArea = factory.updateOne(Area,{id:"areaId"});
//delete one area
exports.deleteArea = factory.deleteOne(Area,{id:"areaId"});