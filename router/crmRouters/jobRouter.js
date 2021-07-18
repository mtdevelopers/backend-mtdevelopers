const express = require("express");
const jobController = require("../../controller/jobController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");

const router = express.Router();


router  
    .route("/")
    .get(jobController.getAllJob)
    .post(authController.protectRoute,
            authorization.detectPermissions("job","write"),
            jobController.createJob);

router
    .route("/:jobId")
    .get(authController.protectRoute,
        authorization.detectPermissions("job","read"),
        jobController.getOneJob)
    .patch(authController.protectRoute,
        authorization.detectPermissions("job","write"),
        jobController.updateOneJob)
    .delete(authController.protectRoute,
        authorization.detectPermissions("job","delete"),
        jobController.deleteOneJob);


module.exports = router;