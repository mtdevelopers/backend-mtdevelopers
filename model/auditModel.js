const mongoose = require("mongoose");


const auditSchema = new mongoose.Schema({
    action:{
        type:String,
        required:true
    },
    createdBy:Object,
    documentType:{
        type:String,
        enum:["property","requestProperty","realtor"]
    },
    searchFilter:Object,
    differents:Object,
    property:{type:mongoose.Schema.Types.ObjectId,ref:"Property"},
    requestProperty:{type:mongoose.Schema.Types.ObjectId, ref:"RequestProperty"},
    realtor:{type:mongoose.Schema.Types.ObjectId , ref:"Realtor"},

},{
    timestamps:true
});


const Audit = mongoose.model("Audit",auditSchema);

module.exports = Audit;