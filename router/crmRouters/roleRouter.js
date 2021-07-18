const express = require("express");
const roleController = require("../../controller/roleController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");

const router = express.Router();

router.route("/")
        .get(roleController.getAllRole)
        .post(
                authController.protectRoute,
                authorization.detectPermissions("role","write"),
                roleController.createOneRole);


router.route("/:roleId")
            .get(
                authController.protectRoute,
                authorization.detectPermissions("role","read"),
                roleController.getOneRole)
            .patch(
                authController.protectRoute,
                authorization.detectPermissions("role","write"),
                roleController.updateOneRole)
            .delete(authController.protectRoute,
                authorization.detectPermissions("role","delete"),
                roleController.deleteOneRole);

        
module.exports = router;