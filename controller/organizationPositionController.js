const OrganizationPosition = require("../model/authorizationRelatedModel/organizationPosition");
const factory = require("./factory/crmFunctionFactory");


exports.getAllOrganizationPosition = factory.getAll(OrganizationPosition,{identifier:"organizationPosition"});
exports.createOneOrganizationPosition= factory.createOne(OrganizationPosition,{identifier:"organizationPosition"});

exports.getOneOrganizationPosition = factory.getOne(OrganizationPosition,{id:"organizationPositionId"});
exports.updateOneOrganizationPosition = factory.updateOne(OrganizationPosition,{id:"organizationPositionId"});
exports.deleteOneOrganizationPosition = factory.deleteOne(OrganizationPosition,{id:"organizationPositionId"});