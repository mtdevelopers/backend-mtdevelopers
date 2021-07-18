const express = require("express");
const buyStepsController = require("../../controller/buyStepsController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");


const router = express.Router();

router
    .route("/")
    .get(buyStepsController.getAllBuySteps)
    .post(authController.protectRoute,
        authorization.detectPermissions("buySteps","write"),
        buyStepsController.createOneBuySteps);

router
    .route("/:buystepsId")
    .get(authController.protectRoute,
        authorization.detectPermissions("buySteps","read"),
        buyStepsController.getOneBuySteps)
    .delete(authController.protectRoute,
        authorization.detectPermissions("buySteps","write"),
        buyStepsController.deleteOneBuySteps)
    .patch(authController.protectRoute,
        authorization.detectPermissions("buySteps","delete"),
        buyStepsController.updateOneBuySteps);


module.exports = router;