const express = require("express");
const propertyRouter = require("./propertyRouter");
const areaController = require("../../controller/locationController/areaController");


const router = express.Router({mergeParams:true});
router.use("/:areaId/property",propertyRouter);


router.route("/").get(areaController.getAllArea);

router.route("/:areaId").get(areaController.getOneArea);


module.exports = router;