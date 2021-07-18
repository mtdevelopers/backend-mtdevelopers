const mongoose = require("mongoose");
const auditPlugin = require("../utils/auditPlugin");

const areaSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"لطفا نام منطقه را وارد کنید."],
        unique:true
    },
    city:{type:mongoose.Schema.Types.ObjectId,ref:"City"},
    workplace:{type:mongoose.Schema.Types.ObjectId, ref:"Workplace"}
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
// areaSchema.virtual("lines",{
//     ref:"Line",
//     localField:"_id",
//     foreignField:"area"

// });


// areaSchema.pre(/^find/,function(next){
//     this.populate("lines");
//     next();
// })


areaSchema.plugin(auditPlugin);

const Area = mongoose.model("Area",areaSchema);

module.exports=Area;