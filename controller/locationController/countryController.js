const factory = require("../factory/crmFunctionFactory");
const Country = require("../../model/countryModel");

exports.getAllCountry = factory.getAll(Country,{identifier:"country"});
exports.createOneCountry = factory.createOne(Country,{identifier:"country"});
exports.getOneCountry = factory.getOne(Country,{id:"countryId"});
exports.updateOneCountry = factory.updateOne(Country,{id:"countryId"});
exports.deleteOneCountry = factory.deleteOne(Country,{id:"countryId"});
