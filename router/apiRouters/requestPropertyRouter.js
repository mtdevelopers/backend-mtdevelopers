const express = require("express");
const requestPropertyController = require("../../controller/propertyRelatedController/apiRequestProperty");
const authController = require("../../controller/userRelatedController/userAuthController");

const router = express.Router({mergeParams:true});

router.use(authController.protectRoute);

router.get("/myrequests",requestPropertyController.getMyRequests,
                        requestPropertyController.getAllRequestProperty);

router
    .route("/")
    // .get(requestPropertyController.getAllRequestProperty)
    .post(requestPropertyController.createOneRequestProperty);

router
    .route("/:requestpropertyId")
    .get(requestPropertyController.getOneRequestProperty)
    .patch(authController.protectRoute,
        authController.authorizationForRequest,
        requestPropertyController.updateOneRequestProperty)
    .delete(authController.protectRoute,
        authController.authorizationForRequest,
        requestPropertyController.deleteOneRequestProperty);



module.exports = router;