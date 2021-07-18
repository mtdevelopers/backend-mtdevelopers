const mongoose = require("mongoose");
const auditPlugin = require("../../utils/auditPlugin");

const roleSchema = new mongoose.Schema({
    // for example read write update delete
    title:{
        type:String,
        required:[true,"هر نقش دارای نام است"],
        unique:true
    },
    roleType:{
        type:String,
        // required:[true,"هر نقش دارای یک کلید است."],
        eum:["realtor","manager","deputy","legalDeputy","head-Manager"]
    },
    // operations that user can do read write update delete
    permissions:{type:Array,required:[true,"هر نقش دارای مجوزهایی است!"]},
    //for new realtors it should be true so that realtor can access own properties
    accessOwnProperty:{
        type:Boolean,
        default:false,
    },
    accessOwnRequestProperty:{
        type:Boolean,
        default:false,
    },
    propertyStatusCanSee:[{
        type:String,
        enum: ["addedByCustomer", 'inProgressByRealtor','confirmedByRealtor',"confirmedByManager","legalCheck" ,'rejected',"ended","archived","recycleBin"], 
        required:[true,"چه آگهی هایی برای این نقش در صفحه ی آگهی ها نمایش داده شود؟"]
    }],
    description:String,
    createPropertyRestriction:Number
    
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  });


roleSchema.virtual("realtors",{
    ref:"Realtor",
    localField:"_id",
    foreignField:"role"
});

// const autoPopulate = function(next){
//     this.populate("realtors");
//     next();
// };
// roleSchema.pre(/^find/,autoPopulate);


roleSchema.plugin(auditPlugin);
const Role = mongoose.model("Role",roleSchema);

module.exports = Role;