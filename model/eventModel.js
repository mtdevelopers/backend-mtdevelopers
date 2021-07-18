const mongoose = require("mongoose");
const auditPlugin = require("../utils/auditPlugin");

const eventSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:["trade","vacation","study","findFile","findArea"],
        required:[true,"هر رویداد دارای یک عنوان است!"]
    },
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"},
    date:{
        type:Date,
        required:[true,"هر رویداد دارای تاریخ اقدام است!"]
    },
    time:{
        type:Date,
        required:[true,"هر رویداد دارای ساعت اقدام است!"]
    },
    propertyCode:{
        type:Number,
        required:[true,"هر رویداد برای یک آگهی ثبت می شود!"]
    },
    feedback:{type:mongoose.Schema.Types.ObjectId,ref:"Feedback"},
    feedbackDate:Date,
    descriptions:String
});


eventSchema.plugin(auditPlugin);


const Event = mongoose.model("Event",eventSchema);

module.exports=Event;