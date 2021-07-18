const factory = require("../factory/crmFunctionFactory");
const Line = require("../../model/lineModel");

exports.getAllLine = factory.getAll(Line);
exports.createOneLine = factory.createOne(Line);
exports.getOneLine = factory.getOne(Line,{id:"lineId"});
exports.updateOneLine = factory.updateOne(Line,{id:"lineId"});
exports.deleteOneLine = factory.deleteOne(Line,{id:"lineId"});