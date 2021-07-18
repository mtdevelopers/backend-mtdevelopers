const City = require("../../model/cityModel");
const factory = require("../factory/crmFunctionFactory");

//list all cities
exports.getAllCity = factory.getAll(City,{identifier:"city"});

//create a city
exports.createCity = factory.createOne(City,{identifier:"city"});


//get a city by id
exports.getOneCity = factory.getOne(City,{id:"cityId"});

exports.updateOneCity = factory.updateOne(City,{id:"cityId"});

//delete a city by id
exports.deleteCity = factory.deleteOne(City,{id:"cityId"});

