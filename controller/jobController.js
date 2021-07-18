const catchAsync = require("../utils/catchAsync");
const Job = require("../model/userRelatedModels/jobModel");
const factory = require("./factory/crmFunctionFactory");

// list all job
exports.getAllJob = factory.getAll(Job,{identifier:"job"});

//create job
exports.createJob = factory.createOne(Job,{identifier:"job"});

//get job by id
exports.getOneJob = factory.getOne(Job,{id:"jobId"});
exports.updateOneJob = factory.updateOne(Job,{id:"jobId"});
//delete one job by id
exports.deleteOneJob = factory.deleteOne(Job,{id:"jobId"});