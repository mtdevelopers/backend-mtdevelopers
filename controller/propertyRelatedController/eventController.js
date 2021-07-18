const Event = require("../../model/eventModel");
const factory = require("../factory/crmFunctionFactory");


exports.getAllEvent = factory.getAll(Event,{identifier:"event"});
exports.createOneEvent = factory.createOne(Event,{identifier:"event"});
exports.getOneEvent = factory.getOne(Event,{id:"eventId"});
exports.updateOneEvent = factory.updateOne(Event,{id:"eventId"});
exports.deleteOneEvent = factory.deleteOne(Event,{id:"eventId"});