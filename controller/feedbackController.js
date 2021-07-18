const Feedback = require("../model/propertyModel/feedbackModel");
const factory = require("../controller/factory/crmFunctionFactory");


exports.getAllFeedback = factory.getAll(Feedback,{identifier:"feedback"});
exports.createFeedback = factory.createOne(Feedback,{identifier:"feedback"});

exports.getOneFeedback = factory.getOne(Feedback,{id:"feedbackId"});
exports.updateFeedback = factory.updateOne(Feedback,{id:"feedbackId"});
exports.deleteFeedback = factory.deleteOne(Feedback,{id:"feedbackId"});