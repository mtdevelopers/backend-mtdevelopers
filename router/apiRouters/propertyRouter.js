const express = require("express");

// import controllers
const propertyController = require("../../controller/propertyRelatedController/apiPropertyController");
const specialPropertyController = require("../../controller/propertyRelatedController/specialRoutesController");
const imageProcessor = require("../../utils/imageProccessor");
const authenticationController = require("../../controller/userRelatedController/userAuthController");


const router = express.Router({mergeParams:true});

// special routes ==> api/v1/property/newest
router.get('/newest',specialPropertyController.newest,propertyController.getAllProperty);
router.get('/lowestprice',specialPropertyController.lowestPrice,propertyController.getAllProperty);
router.get('/highestprice',specialPropertyController.highestPrice,propertyController.getAllProperty);
// router.get('/newest',specialPropertyController.newest,propertyController.getAllProperty);

//enter url such as lng,lat e.g. longititude first
router.get("/properties-within/:distance/center/:latlng/unit/:unit",propertyController.findNearProperties);

//special property
router.get("/specialproperty",
        propertyController.getConfirmedProperty,
        propertyController.getSpecialProperty,
        propertyController.getAllProperty);




router
    .route("/") 
    .get(propertyController.getConfirmedProperty,propertyController.getAllProperty)
    .post(authenticationController.protectRoute,
        imageProcessor.uploadPropertyImg,
        imageProcessor.addWatermarkAndResize,
        propertyController.createOneProperty);

router
    .route("/:propertyId")
    .get(propertyController.getOneProperty)
    .patch(authenticationController.protectRoute,
        authenticationController.authorization,
        propertyController.updateOneProperty)
    .delete(authenticationController.protectRoute,
        authenticationController.authorization,
        propertyController.deleteOneProperty);





module.exports = router;
