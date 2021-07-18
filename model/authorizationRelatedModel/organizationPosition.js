const mongoose = require("mongoose");
const auditPlugin = require("../../utils/auditPlugin");


// Fields of work
const organizationPositionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"پست سازمانی دارای نام است!"],
        unique:true
    },
    documentType:{
        type:String,
        enum:["property","car"],
        default:"property"
    },
    status_property:[{
        type:String,
        enum:["residential","commercial","villa","land"],
        required:[true,"هر نقش دارای زمینه ی کاری است"]
    }],
    status_sell:[{
        type:String,    
        enum:["forSell","forRent","preSell","participation"],

    }],
    category_property:[{
        type:String,
        enum:["apartment","yard","shop","workplace","factory","underFloor","mall","officeBuilding"]

    }]
});

organizationPositionSchema.plugin(auditPlugin);
const OrganizationPosition = mongoose.model("OrganizationPosition",organizationPositionSchema);

module.exports = OrganizationPosition;