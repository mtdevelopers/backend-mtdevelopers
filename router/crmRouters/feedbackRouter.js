const express = require("express");
const feedbackController = require("../../controller/feedbackController");
const authController = require("../../controller/realtorRelatedController/realtorAuthController");
const authorization = require("../../controller/securityController/globalAuthorization");

const router = express.Router();


router.route("/")
        .get(feedbackController.getAllFeedback)
        .post(authController.protectRoute,
                authorization.detectPermissions("feedback","write"),
                feedbackController.createFeedback);

router.route("/:feedbackId")
        .get(authController.protectRoute,
                authorization.detectPermissions("feedback","read"),
                feedbackController.getOneFeedback)
        .patch(authController.protectRoute,
                authorization.detectPermissions("feedback","write"),
                feedbackController.updateFeedback)
        .delete(authController.protectRoute,
                authorization.detectPermissions("feedback","delete"),
                feedbackController.deleteFeedback);




module.exports = router;