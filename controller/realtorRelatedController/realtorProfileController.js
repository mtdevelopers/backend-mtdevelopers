const Realtor = require("../../model/realtorRelatedModel/realtorModel");
const factory = require("../factory/functionFactory");


exports.getOneRealtor = factory.getOne(Realtor,{id:"realtorId"});