const express = require("express");
const authController = require("../../../controller/realtorRelatedController/realtorAuthController");
const cityController = require("../../../controller/locationController/cityController");
const authorization = require("../../../controller/securityController/globalAuthorization");
// import area routes for nested routes
const areaRouter = require("./areaRouter");
const realtorRouter = require("../realtorRouter");
const propertyRouter = require("../../crmRouters/crmPropertyRouter");

//nested Routes
const router = express.Router({mergeParams:true});
router.use("/:cityId/area",areaRouter);
router.use("/:cityId/property",propertyRouter);
router.use("/:cityId/realtor",realtorRouter);


router  
    .route("/")
    .get(cityController.getAllCity)
    .post(authController.protectRoute,
        authorization.detectPermissions("city","write"),
        cityController.createCity);

router
    .route("/:cityId")
    .get(cityController.getOneCity)
    .patch(authController.protectRoute,
        authorization.detectPermissions("city","write"),
        cityController.updateOneCity)
    .delete(authController.protectRoute,
            authorization.detectPermissions("city","delete"),
            cityController.deleteCity);


module.exports = router;