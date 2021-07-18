const express = require("express");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const realtorController = require("../../controller/realtorRelatedController/realtorController");
const specialRoutesController = require("../../controller/realtorRelatedController/specialRoutesController");
const propertyRouter = require("../apiRouters/propertyRouter")
const imageProcessor = require("../../utils/imageProccessor");
const authorization = require("../../controller/securityController/globalAuthorization");



const router = express.Router({mergeParams:true});
router.use("/:realtorId/property",propertyRouter);

///////////////////////////////////Authentication Routes //////////////////////////////
router
    .post("/signup",authController.signUp);
router
    .post("/login",authController.logIn);
// router
//     .post("/check",authController.checkVerificationCode);
// router
//     .post("/resendtoken",authController.resendToken);
router
    .post("/logout",authController.logOut);
router
    .post("/resetpassword/:token",authController.resetPassword);
router
    .post("/forgetpassword",authController.forgetPassword);
router
    .post("/updatepassword",authController.protectRoute,authController.updatePassword);
router
    .patch("/updateme",authController.protectRoute,imageProcessor.uploadRealtorImg,imageProcessor.resizeImg,realtorController.updateMe);
router
    .delete("/deleteme",authController.protectRoute,realtorController.deleteMe);

/////////////////////////////////////// CRUD Routes ////////////////////////////////////
//special routes for realtor administrator
// router.get("/bestSeller",)

// admin routes
router.use(authController.protectRoute);

router
    .route("/")
    .get(
        authorization.detectPermissions("realtor","read"),
        authorization.authorize("realtor","read"),
        realtorController.getAllRealtor)
    .post(
        authorization.detectPermissions("realtor","write"),
        authorization.authorize("realtor","write"),
        realtorController.createOneRealtor);
router
    .route("/:realtorId")
    .get(realtorController.getOneRealtor)
    .patch(
        authorization.detectPermissions("realtor","write"),
        authorization.authorize("realtor","write"),
        imageProcessor.uploadRealtorImg,
        imageProcessor.resizeImg,
        realtorController.updateOneRealtor)
    .delete(
        authorization.detectPermissions("realtor","delete"),
        authorization.authorize("realtor","delete"),
        realtorController.deleteOneRealtor);




module.exports = router;