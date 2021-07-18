const mongoose = require("mongoose");
const auditPlugin = require("../utils/auditPlugin");




const countrySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"کشور باید دارای نام باشد"],
        unique:true
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// countrySchema.virtual("allStates",{
//     ref:"State",
//     localField:"_id",
//     foreignField:"country"
// });
// countrySchema.pre(/^find/,function(next){
//     this.populate("allStates");
//     next();
// })

countrySchema.plugin(auditPlugin);
const Country = mongoose.model("Country",countrySchema);

module.exports = Country;