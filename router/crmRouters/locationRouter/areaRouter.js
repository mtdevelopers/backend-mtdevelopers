const express = require("express");

const areaController = require("../../../controller/locationController/areaController");
const workplaceRouter = require("./workplaceRouter");
const propertyRouter = require("../../crmRouters/crmPropertyRouter");
const authController = require("../../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../../controller/securityController/globalAuthorization")



const router = express.Router({mergeParams:true});
router.use("/:areaId/workplace",workplaceRouter);
router.use("/:areaId/property",propertyRouter);


router  
    .route("/")
    .get(areaController.getAllArea)
    .post(
        authController.protectRoute,
        authorization.detectPermissions("area","write"),
        areaController.createArea);

router
    .route("/:areaId")
    .get(areaController.getOneArea)
    .patch(
        authController.protectRoute,
        authorization.detectPermissions("area","write"),
        areaController.updateOneArea)
    .delete(
        authController.protectRoute,
        authorization.detectPermissions("area","delete"),
        areaController.deleteArea);


module.exports = router;