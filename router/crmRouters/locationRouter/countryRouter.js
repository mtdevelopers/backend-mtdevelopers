const express = require("express");
const countryController = require("../../../controller/locationController/countryController");
const authController = require("../../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../../controller/securityController/globalAuthorization");



const router = express.Router();

router.route("/")
        .get(countryController.getAllCountry)
        .post(authController.protectRoute,
                authorization.detectPermissions("country","write"),
                countryController.createOneCountry);

router.route("/:countryId")
        .get(authController.protectRoute,
                countryController.getOneCountry)
        .patch(authController.protectRoute,
                authorization.detectPermissions("country","write"),
                countryController.updateOneCountry)
        .delete(authController.protectRoute,
                authorization.detectPermissions("country","delete"),
                countryController.deleteOneCountry);


module.exports = router;