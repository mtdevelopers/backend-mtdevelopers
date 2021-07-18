const express = require("express");
const stateController = require("../../../controller/locationController/stateController");
//
const cityRouter = require("./cityRouter");
const realtorRouter = require("../realtorRouter");
const propertyRouter = require("../crmPropertyRouter");
const authController = require("../../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../../controller/securityController/globalAuthorization");


const router = express.Router();
router.use("/:stateId/city",cityRouter);
router.use(":/stateId/realtor",realtorRouter);
router.use(":/stateId/property",propertyRouter);




router
    .route("/")
    .get(stateController.getAllStates)
    .post(authController.protectRoute,
        authorization.detectPermissions("state","write"),    
        stateController.createState);
router
    .route("/:stateId")
    .get(authController.protectRoute,stateController.getOneState)
    .patch(authController.protectRoute,
        authorization.detectPermissions("state","write"),    
        stateController.updateOneCity)
    .delete(authController.protectRoute,
        authorization.detectPermissions("state","delete"),    
        stateController.deleteOneState);

module.exports = router;