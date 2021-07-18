const express = require("express");
const lineController = require("../../../controller/locationController/lineController");
const propertyRouter = require("../../apiRouters/propertyRouter");
const realtorRouter = require("../realtorRouter");
const authController = require("../../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../../controller/securityController/globalAuthorization");


const router = express.Router({mergeParams:true});
router.use("/:lineId/property",propertyRouter);
router.use("/:lineId/realtor",realtorRouter);

router
    .route("/")
    .get(lineController.getAllLine)
    .post(authController.protectRoute,
        authorization.detectPermissions("line","write"),
        lineController.createOneLine);

router
    .route("/:lineId")
    .get(lineController.getOneLine)
    .patch(authController.protectRoute,
        authorization.detectPermissions("line","write"),
        lineController.updateOneLine)
    .delete(lineController.deleteOneLine);


module.exports = router;