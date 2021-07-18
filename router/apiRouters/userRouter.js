const express = require("express");
const authController = require("../../controller/userRelatedController/userAuthController");
const userController = require("../../controller/userRelatedController/userController");
const propertyRouter = require("./propertyRouter");
const requestPropertyRouter = require("./requestPropertyRouter");
const propertyController = require("../../controller/propertyRelatedController/apiPropertyController");
const requestPropertyControler = require("../../controller/propertyRelatedController/apiRequestProperty");



const router = express.Router();
router.use("/:userId/property",propertyRouter);
router.use("/:userId/requestproperty",requestPropertyRouter);


///////////////////////////////authentication routes////////////////////////

router  
    .post("/login",authController.logIn);
router
    .post("/:mobileNumber/check",authController.checkVerificationCode);

router
    .post("/:mobileNumber/resendcode",authController.resendToken);

router  
    .post("/logout",authController.logOut);


router.get("/myproperties",authController.protectRoute,
                        propertyController.getMyProperties,
                        propertyController.getAllProperty);
router.get("/myrequests",authController.protectRoute,
                        requestPropertyControler.getMyRequests,
                        requestPropertyControler.getAllRequestProperty);   
router
    .patch("/updateme",authController.protectRoute,userController.updateMe);
router
    .delete("/deleteme",authController.protectRoute,userController.deleteMe);

//////////////////////////user CRUD Routes ///////////////////////



module.exports = router;



