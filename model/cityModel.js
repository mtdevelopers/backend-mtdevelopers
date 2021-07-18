const mongoose = require("mongoose");
const auditPlugin = require("../utils/auditPlugin");



const citySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"هر شهر دارای یک نام است"],
        unique:true
    },
    state:{type:mongoose.Schema.Types.ObjectId,ref:"State"},
    
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// citySchema.virtual("areas",{
//     ref:"Area",
//     localField:"_id",
//     foreignField:"city"
// });
// citySchema.virtual("workplaces",{
//     ref:"Workplace",
//     localField:"_id",
//     foreignField:"city"
// });

// citySchema.pre(/^find/,function(next){
//     this.populate("areas").populate("workplaces");
//     next();
// })


citySchema.plugin(auditPlugin);
const City = mongoose.model("City",citySchema);
module.exports = City;