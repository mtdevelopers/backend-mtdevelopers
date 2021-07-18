const mongoose = require("mongoose");
const auditPlugin = require("../../utils/auditPlugin");



const feedbackSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"لطفا عنوان رویداد مورد نظر را وارد نمایید!"]
    },
    type:{
        type:String,
        enum:["positive","negative"]
    }
});

feedbackSchema.virtual("requestProperty",{
    ref:"RequestProperty",
    localField:"_id",
    foreignField:"feedback"
});
const autoPopulateRequestProperty = function(next){
    this.populate("requestProperty");
    next();
}

// feedbackSchema.pre(/^find/,autoPopulateRequestProperty);

feedbackSchema.plugin(auditPlugin);
const Feedback = mongoose.model("Feedback",feedbackSchema);

module.exports = Feedback;