const express = require("express");
const requestPropertyController = require("../../controller/propertyRelatedController/requestPropertyController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");
const statsController = require("../../controller/propertyRelatedController/statsController");
const RequestProperty = require("../../model/propertyModel/requestPropertyModel");


const router = express.Router({mergeParams:true});



/// request Property 

router.use(authController.protectRoute);

//request property stats
router.get("/requestPropertyStats",
                    authorization.detectPermissions("stats","read"),
                    authorization.authorize("stats","read"),
                    statsController.getPropertyStats(RequestProperty));


router.get("/waitforconfirm",
                        requestPropertyController.waitForConfirm,
                        requestPropertyController.getAllRequestPropertyByPopulate);


router.get("/myrequests",
                        requestPropertyController.myRequestProperty,
                        requestPropertyController.getAllRequestPropertyByPopulate);
router.get("/refrencetome",
                        requestPropertyController.refrencedToMe,
                        requestPropertyController.getAllRequestPropertyByPopulate);

router
    .route("/")
    .get(    requestPropertyController.confirmedRequestProperty,
                authorization.detectPermissions("requestProperty","read"),
            authorization.authorize("requestProperty","read"),
            requestPropertyController.getAllRequestProperty)
    .post(authorization.detectPermissions("requestProperty","write"),
            authorization.authorize("requestProperty","write"),
            requestPropertyController.createOneRequestProperty);

router
    .route("/:requestpropertyId")
    .get(requestPropertyController.getOneRequestProperty)
    .patch(authorization.detectPermissions("requestProperty","update"),
            authorization.authorize("requestProperty","update"),
            requestPropertyController.updateOneRequestProperty)
    .delete(authorization.detectPermissions("requestProperty","delete"),
            authorization.authorize("requestProperty","delete"),
            requestPropertyController.deleteOneRequestProperty);



module.exports = router;