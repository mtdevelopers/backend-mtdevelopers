const News = require("../model/newsModel");
const factory = require("./factory/crmFunctionFactory");



exports.getAllNews = factory.getAll(News,{identifier:"news"});
exports.createOneNews = factory.createOne(News,{identifier:"news"});
exports.getOneNews = factory.getOne(News,{identifier:"news"});
exports.updateOneNews = factory.updateOne(News,{identifier:"news"});
exports.deleteOneNews = factory.deleteOne(News,{identifier:"news"});