const mongoose = require("mongoose");
const auditPlugin = require("../../utils/auditPlugin");

const buystepsSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required:[true,"هر مرحله از خرید دارای نام است!"]
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

buystepsSchema.virtual("requests",{
    ref:"RequestProperty",
    localField:"_id",
    foreignField:"buySteps"
});

// buystepsSchema.pre(/^find/,function(next){
//     this.populate("requests");
//     next();
// })


buystepsSchema.plugin(auditPlugin);

const Buysteps = mongoose.model("Buysteps",buystepsSchema);

module.exports = Buysteps;