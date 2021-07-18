const express = require("express");
const countryController = require("../../controller/locationController/countryController");


const router = express.Router();

router.route("/")
        .get(countryController.getAllCountry);
router.route("/:countryId")
        .get(countryController.getOneCountry);
        
module.exports = router;