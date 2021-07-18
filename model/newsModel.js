const mongoose = require("mongoose");


const newsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"عنوان خیر را وارد کنید!"]
    },
    description:{
        type:String,
        required:[true,"متن خبر را وارد کنید!"]
    },
    creator:{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"}
});





const News = mongoose.model("News",newsSchema);

module.exports= News;