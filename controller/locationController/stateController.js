const State = require("../../model/stateModel");
const factory = require("../factory/crmFunctionFactory");


//list all state
exports.getAllStates = factory.getAll(State,{identifier:"state"});

//create a state
exports.createState= factory.createOne(State,{identifier:"state"});

//get one state by id
exports.getOneState = factory.getOne(State,{id:"stateId"});
//
exports.updateOneCity = factory.updateOne(State,{id:"stateId"});
//delete a state by id
exports.deleteOneState = factory.deleteOne(State,{id:"stateId"});
