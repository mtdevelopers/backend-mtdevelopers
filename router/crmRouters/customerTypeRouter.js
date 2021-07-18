const express = require("express");
const customerTypeController = require("../../controller/propertyRelatedController/customerTypeController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization")

const router = express.Router();


router.route("/")
        .get(customerTypeController.getAllCustomerType)
        .post(authController.protectRoute,
                authorization.detectPermissions("customerType","write"),
                customerTypeController.createOneCustomerType);

router.route("/:customerTypeId")
        .get(authController.protectRoute,
                authorization.detectPermissions("customerType","read"),
                customerTypeController.getOneCustomerType)
        .patch(authController.protectRoute,
                authorization.detectPermissions("customerType","write"),
                customerTypeController.updateOneCustomerType)
        .delete(authController.protectRoute,
                authorization.detectPermissions("customerType","delete"),
                customerTypeController.deleteOneCustomerType);





module.exports = router;