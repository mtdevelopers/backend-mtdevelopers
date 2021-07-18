const express = require("express");

const workplaceController = require("../../../controller/locationController/workplaceController");
const lineRouter = require("./lineRouter");
const realtorRouter = require("../realtorRouter");
const propertyRouter = require("../crmPropertyRouter");

const authController = require("../../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../../controller/securityController/globalAuthorization");




const router = express.Router({mergeParams:true});
router.use("/:workplaceId/line",lineRouter);
router.use("/:workplaceId/realtor",realtorRouter);
router.use("/:workplaceId/property",propertyRouter);

router  
    .route("/")
    .get(workplaceController.getAllWorkplace)
    .post(authController.protectRoute,
        authorization.detectPermissions("workpllace","write"),
        workplaceController.createWorkplace);

router
    .route("/:workplaceId")
    .get(workplaceController.getOneWorkplace)
    .patch(authController.protectRoute,
        authorization.detectPermissions("workplace","write"),
        workplaceController.updateOneWorkPlace)
    .delete(
        authorization.detectPermissions("workpllace","delete"),
        workplaceController.deleteOneWorkplace);


module.exports = router;