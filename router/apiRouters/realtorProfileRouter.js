const express = require("express");
const realorProfileController = require("../../controller/realtorRelatedController/realtorProfileController");

const router=express.Router();

router.route("/:realtorId").get(realorProfileController.getOneRealtor);


module.exports = router;