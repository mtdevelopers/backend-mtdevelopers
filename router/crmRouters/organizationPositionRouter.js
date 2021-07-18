const express = require("express");
const organizationPositionController = require("../../controller/organizationPositionController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");

const router = express.Router();

router.route("/")
        .get(organizationPositionController.getAllOrganizationPosition)
        .post(authController.protectRoute,
                authorization.detectPermissions("organizationPosition","write"),
                organizationPositionController.createOneOrganizationPosition);


router.route("/:organizationPositionId")
        .get(authController.protectRoute,
                authorization.detectPermissions("organizationPosition","read"),
                organizationPositionController.getOneOrganizationPosition)
        .patch(authController.protectRoute,
                authorization.detectPermissions("organizationPosition","write"),
                organizationPositionController.updateOneOrganizationPosition)
        .delete(authController.protectRoute,
                authorization.detectPermissions("organizationPosition","delete"),
                organizationPositionController.deleteOneOrganizationPosition);





module.exports = router;