const express = require("express");
const Property = require("../../model/propertyModel/propertyModel");
// import controllers
const propertyController = require("../../controller/propertyRelatedController/propertyController");
const specialPropertyController = require("../../controller/propertyRelatedController/specialRoutesController");
const imageProcessor = require("../../utils/imageProccessor");
const authorization = require("../../controller/securityController/globalAuthorization");
const authenticationController = require("../../controller/realtorRelatedController/realtorAuthController");
const statsController = require("../../controller/propertyRelatedController/statsController");

const router = express.Router({mergeParams:true});

router.use(authenticationController.protectRoute);



// special routes ==> api/v1/property/newest
router.get('/newest',specialPropertyController.newest,propertyController.getAllProperty);
router.get('/lowestprice',specialPropertyController.lowestPrice,propertyController.getAllProperty);
router.get('/highestprice',specialPropertyController.highestPrice,propertyController.getAllProperty);
// router.get('/newest',specialPropertyController.newest,propertyController.getAllProperty);

//stats router
router.get("/propertyStats",
authorization.detectPermissions("stats","read"),
authorization.authorize("stats","read"),
statsController.getPropertyStats(Property));


router.get("/myproperties",
                    propertyController.getMyProperties,
                    propertyController.getAllProperty);

router.get("/waitingforconfirm",
                        authorization.detectPermissions("property","read"),
                        authorization.authorize("property","read"),
                        propertyController.waitingForConfirm,
                        propertyController.getAllProperty);
router.get("/propertyneedtoupdate",authorization.detectPermissions("property","read"),
                                    authorization.authorize("property","read"),
                                    propertyController.getNeedToUpdate,
                                    propertyController.getAllProperty);
                        
//localHost:3000/api/v1/user/:user:userId/property/:propertyId
//localHost:3000/api/v1/property/:id
// simple users can access this routes 
router
    .route("/")
    .get(
        authorization.detectPermissions("property","read"),
        authorization.authorize("property","read"),
        propertyController.canSeeMidlleware,
        propertyController.getAllProperty)
    .post(
        
        authorization.detectPermissions("property","write"),
        authorization.authorize("property","write"),
        imageProcessor.uploadPropertyImg,
        imageProcessor.addWatermarkAndResize,
        propertyController.createOneProperty);

router
    .route("/:propertyId")
    .get(propertyController.getOneProperty)
    .patch(
        
        authorization.detectPermissions("property","update"),
        authorization.authorize("property","update"),
        propertyController.updateOneProperty)
    .delete(
        authorization.detectPermissions("property","delete"),
        authorization.authorize("property","delete"),
        propertyController.deleteOneProperty);





module.exports = router;
