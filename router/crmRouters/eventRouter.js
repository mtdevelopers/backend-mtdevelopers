const express = require("express");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");
const eventController = require("../../controller/propertyRelatedController/eventController");



const router = express.Router();

router.use(authController.protectRoute);
router.route("/")
        .get(authorization.detectPermissions("event","read"),
                eventController.getAllEvent)
        .post(authorization.detectPermissions("event","write"),
                eventController.createOneEvent);


router.route("/:eventId")
        .get(authorization.detectPermissions("event","read"),
            eventController.getOneEvent)
        .patch(authorization.detectPermissions("event","write"),
                eventController.updateOneEvent)
        .delete(authorization.detectPermissions("event","delete"),
                eventController.deleteOneEvent);


module.exports = router;