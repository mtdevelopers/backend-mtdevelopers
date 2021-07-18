const express = require("express");
const auditController = require("../../controller/auditController");
const authentication = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");




const router = express.Router();

router.use(authentication.protectRoute,
    authorization.detectPermissions("audit","read"));

router.route("/").get(auditController.getAllAudit);
router.get("/:auditId",auditController.getOneAudit);


module.exports = router;