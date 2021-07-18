const mongoose = require("mongoose");
const auditPlugin = require("../../utils/auditPlugin");


const requestPropertySchema = new mongoose.Schema({
    code: { type: Number, unique: true },
    createdByRealtor: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' },
    inProgressedByRealtor:{type:mongoose.Schema.Types.ObjectId, ref:"Realtor"},
    confirmedByRealtor:{type:mongoose.Schema.Types.ObjectId, ref:"Realtor"},
    createdByCustomer:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    creator:{type:String,enum:["customer","realtor"]},
    updatedLog:{
        realtor: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' },
        date: Date
    } ,
    status: { 
        type: String, 
        enum: ["addedByCustomer", 'inProgressByRealtor','confirmedByRealtor', 'rejected',"archived","recycleBin"]
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    country:{type:mongoose.Schema.Types.ObjectId , ref: "Country"},
    state:{type:mongoose.Schema.Types.ObjectId , ref: "State"},
    city:{type:mongoose.Schema.Types.ObjectId , ref: "City"},
    areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
    status_sell:[{
        type:String,
        enum:["forSell","forRent","preSell","participation"],//خرید-اجاره-پیش خرید-مشارکت
        required:[true,"وضعیت خرید یا اجاره الزامی است!"]
    }],
    status_property:[{
        type:String,
        enum:["residential","commercial","villa","land"],//مسکونی-تجاری-ویلاباغ-زمین
        required:[true,"لطفا وضعیت ملک را وارد نمایید!"]
    }],
    category_requestProperty:[{
        type:String,
        enum:["apartment","yard","shop","workplace","factory","underFloor","mall","officeBuilding"]
    }],
    yearOfConstruct:[{type:String, enum:["new","lt5","lt10gt5","lt15gt10","lt20gt15","lt25gt20","gt25"]}],
    price_from: { type: Number, default: 0 },
    price_to:{ type: Number, default: 0 },
       
    deposite_price_from: { type: Number, default: 0 },
    deposite_price_to:{ type: Number, default: 0 },
      
    rent_price_from: { type: Number, default: 0 },
    rent_price_to: { type: Number, default: 0 },
        
    space_from: { type: Number, default: 0 },
    space_to:  { type: Number, default: 0 },  
    payway: {
        type: { type: [String], enum: ['cash', 'exchange', 'loan', 'withAds'], default: 'cash' },
        loan: {
            amount: { type: Number },
            expireDate: Date,
            type: { type: String, enum: ['first', 'stocks', 'employee', 'veteran', 'other'], default: 'first' },
        },
        // exchange: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' },
        // withAds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ad' }]
    },
    referal: {
        type: { type: String, enum: ['website', 'user', 'divar', 'sheypoor', 'telegram', 'instagram', 'consultant', 'other'], default: 'website' },
        userFullName: String,
        other: String
    },
    refrenceToRealtor:[{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"}],
    firstConsultation: { type: String, enum: ['phone', 'inPerson'], default: 'inPerson' },// مشاوره ی اول
    space_under_from: { type: Number, default: 0 },
    space_under_to: { type: Number, default: 0 },
        
    // زیربنا برای حیاط
    document_status:[{
        type:String,
        enum:["sixDong","contractical","golname","ongoing"], //وضعیت سند: شش دانگ - قراردادی- قولنامه ای - در دست اقدام
        
    }],
    geographical_position:[{
        type:String,
        enum:["north","south","west","east","north-east","north-west","north-south","south-east","south-west","east-west","three-corners"],
        // شمالی - جنوبی-غربی-شرقی-شمالیشرقی-شمالیغربی-شماللجنوب-جنولشرق=جنوغرب-غربرق-سه نبش
    }],
    whole_floor:Number, // کل طبقات ساختمان
    each_floor_unit:Number,//تعداد واحد در هر طبقه
    floor:Number, //طبقه
    room_count:Number, //تعداد اتاق
    
    urgent:{ //فوری 
        type:Boolean,
        default:false
    },
    luxury:{//لوکس
        type:Boolean,
        default:false
    },
    elevator: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    description: String,
    feedback:{type:mongoose.Schema.Types.ObjectId, ref:"Feedback"},
    customerType:{type:mongoose.Schema.Types.ObjectId, ref:"CustomerType"},
    buySteps: { type: mongoose.Schema.Types.ObjectId, ref: 'Buysteps' },
    
    },{
        timestamps: true
});
requestPropertySchema.pre("save",function(next){
    if(this.isNew){
        const random = Math.floor((Math.random()/10000000)*Date.now());
        this.code = random;
    }
    next();
});
const autoPopulateTypeAndSteps = function(next){
    this.populate("buySteps").populate("customerType");
    next();
}
const autoPopulateFeedback = function(next){
    this.populate("feedback");
    next();
}
const autoPopulateLocations = function(next){
    this.populate("country").populate("state").populate("city").populate("area");
    next();
}
requestPropertySchema.pre(/^find/,autoPopulateTypeAndSteps);
requestPropertySchema.pre(/^find/,autoPopulateLocations);
requestPropertySchema.pre(/^find/,autoPopulateFeedback);

requestPropertySchema.plugin(auditPlugin);


const RequsetProperty = new mongoose.model("RequestProperty",requestPropertySchema);
module.exports = RequsetProperty;