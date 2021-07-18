const factory = require("./factory/crmFunctionFactory");
const Audit = require("../model/auditModel");




exports.getAllAudit = factory.getAll(Audit,{identifier:"audit"});

exports.getOneAudit = factory.getOne(Audit,{id:"auditId"},{path:"createdBy"})