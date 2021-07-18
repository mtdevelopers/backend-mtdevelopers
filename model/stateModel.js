const mongoose = require("mongoose");
const auditPlugin = require("../utils/auditPlugin");



const stateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"each state must have a name"],
        unique:true
    },country:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Country"
    }
    
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});


// stateSchema.virtual("cities",{
//     ref:"City",
//     localField:"_id",
//     foreignField:"state"
// });

// stateSchema.pre(/^find/,function(next){
//     this.populate("cities");
//     next();
// })


stateSchema.plugin(auditPlugin);
const State = mongoose.model("State",stateSchema);

module.exports = State;