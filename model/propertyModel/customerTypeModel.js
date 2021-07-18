const mongoose = require("mongoose");
const auditPlugin = require("../../utils/auditPlugin");


const customerTypeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"نوع مشتری دارای نام است!"],
        unique:true
    },
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

customerTypeSchema.virtual("requests",{
    ref:"RequestProperty",
    localField:"_id",
    foreignField:"customerType"
});
const autoPopulateRequestProperty = function(next){
    this.populate("requests");
    next();
};

// customerTypeSchema.pre(/^find/,autoPopulateRequestProperty);


customerTypeSchema.plugin(auditPlugin);
const CustomerType = mongoose.model("CustomerType",customerTypeSchema);

module.exports = CustomerType;