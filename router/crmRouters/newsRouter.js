const express = require("express");
const newsController = require("../../controller/newsController");

const router= express.Router();

router.route("/")
        .get(newsController.getAllNews)
        .post(newsController.createOneNews);

router.route("/:newsId")
        .get(newsController.getOneNews)
        .patch(newsController.updateOneNews)
        .delete(newsController.deleteOneNews);


module.exports = router;