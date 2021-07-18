const mongoose = require("mongoose");
const validator = require("validator");
const Property = require("../propertyModel/propertyModel");
const auditPlugin = require("../../utils/auditPlugin");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        select:false
    },
    passwordExpiresAt:Date,
    mobileNumber:{
        type:Number,
        required:[true,"شماره تلفن همراه خود را بدون صفر وارد کنید!"],
        unique:true
    },
    phoneNumber:{
        type:Number,
        
    },
    birthDate:{
        type:Date,
    },
    gender:{
        type:Boolean,
        default:true // true for men
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    blocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        //required:[true,"خریدار هستید یا فروشنده!"]
    },
    photo:{
        type:String,
        default:"default.png"
    },
    job: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Job'
        },
    country:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Country"
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"State"
    },
    city:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"City"
    },
    area:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Area"
    },
    isRealtor:{
        type:Boolean,
        default:false
    }
   
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
},{
    timestamps:true
});


//virtual population for properties
userSchema.virtual("properties",{
    ref:"Property",
    localField:"_id",
    foreignField:"createdByCustomer"
});
// hide the users is disactivated
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
});
//population functions
// var autoPopulateProperties = function(next){
//     this.populate({
//         path:"properties",
//     }).populate({
//         path:"requestedProperty",
//     });
//     next();
// }
//populate
// userSchema.pre(/^find/,autoPopulateProperties);

userSchema.methods.verifyOTP = async function(password,otp){
    return password === otp ? true : false
}
userSchema.plugin(auditPlugin);


const User = mongoose.model('User', userSchema);

module.exports = User;