const express = require("express");
const userCityRouter = require("./userCityRouter");
const stateController = require("../../controller/locationController/stateController");
const propertyRouter = require("./propertyRouter");

const router = express.Router({mergeParams:true});
router.use("/:stateId/city",userCityRouter);
router.use("/:stateId/property",propertyRouter);



router.route("/").get(stateController.getAllStates);

router.route("/:stateId").get(stateController.getOneState);


module.exports = router;