const mongoose = require("mongoose");


const lineSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"لطفا نام مسیر مورد نظر را وارد کنید!"],
        unique:true
    },
    area:{type:mongoose.Schema.Types.ObjectId,ref:"Area"}
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// lineSchema.virtual("realtors",{
//     ref:"Realtor",
//     localField:"_id",
//     foreignField:"line"
// });


// lineSchema.pre(/^find/,function(next){
//     this.populate("realtors");
//     next();
// })



const Line = mongoose.model("Line",lineSchema);
module.exports = Line;