const express = require("express");
const areaRouter = require("./userAreaRouter");
const cityController = require("../../controller/locationController/cityController");
const propertyRouter = require("./propertyRouter");


const router = express.Router({mergeParams:true});
router.use("/:cityId/area",areaRouter);
router.use("/:cityId/property",propertyRouter);


router.route("/").get(cityController.getAllCity);

router.route("/:cityId").get(cityController.getOneCity);


module.exports = router;