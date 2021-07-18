const express = require("express");
const userController = require("../../controller/userRelatedController/crmUserConroller");
const authorization = require("../../controller/securityController/globalAuthorization");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");

const router = express.Router();

router  
    .route("/")
    .get(authController.protectRoute,
          authorization.detectPermissions("user","read"),
          authorization.authorize("user","read"),
          userController.getAllUser)
    .post(authController.protectRoute,
          authorization.detectPermissions("user","write"),
          authorization.authorize("user","write"),
          userController.createOneUser);



//actions that admin can do
router
    .route("/:userId")
    .get(userController.getOneUser)
    .patch(authController.protectRoute,
        authorization.detectPermissions("user","update"),
        authorization.authorize("user","update"),
        userController.updateOneUser)
    .delete(authController.protectRoute,
        authorization.detectPermissions("user","delete"),
        authorization.authorize("user","delete"),
        userController.deleteOneUser);


module.exports = router;