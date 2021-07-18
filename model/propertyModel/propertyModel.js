const mongoose =require("mongoose");
const validator = require("validator");
const Area = require("../areaModel");
const auditPlugin = require("../../utils/auditPlugin");


// working on property title
const propertyTypeArray = [
    {'residential':"مسکونی"},
    {'commercial':"تجاری"},
    {'villa':"ویلا"},
    {'land':"زمین- ملک کلنگی"},
];
const tradeTypeArray = [
    {"forSell":"فروش"},
    {"forRent":"اجاره"},
    {"participation":"مشارکت"},
    {"preSell":"پیش فروش"},
];
const categoryPropertyArray = [
    {"apartment":"آپارتمان"},
    {"yard":"حیاط"},
    {"shop":"مغازه"},
    {"workplace":"دفترکار"},
    {"factory":"کارخانه"},
    {"underFloor":"زیرزمین"},
    {"mall":"پاساژ"},
    {"officeBuilding":"ساختمان اداری"}
];

// recieve an array and a key
// returns value of that key inside array
const valueGrabber = (array,selector) => { // residentialTypeArray , apartment
    const selected = array.filter(el => {
        return el[selector];
    })
    return selected[0][selector];
}



const propertySchema = new mongoose.Schema({
    title:String,
    code: { type: Number, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //owner of property
    listOfRealtors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' }], //if a property added by a relator
    createdByCustomer:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    createdByRealtor:{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"},
    inProgressByRealtor:{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"},
    creator:{type:String,enum:["customer","realtor"]},
    space: { type: Number, required: [true,"لطفا متراژ را وارد کنید"] },
    postal_code: {
        type: Number,
        required: true,
        unique:true,
        validate: {
          validator(v) {
            return /^\d{10,10}$/.test(v);
          },
          message: 'کد پستی فقط شامل اعداد می شود!',
        },
      },
    totalPrice: { type: Number, default: 0 },
    deposite_price:Number, //ودیعه
    rent_price:Number, //مقدار اجاره
    yearOfConstruct:{
        type:String,
        enum:["new","lt5","lt10gt5","lt15gt10","lt20gt15","lt25gt20","gt25"],
        // required:[true,"سال ساخت را وارد کنید!"]
    }, //سال ساخت
    // category
    status_sell:{
        type:String,
        enum:["forSell","forRent","preSell","participation"],//فروش-اجاره-پیش فروش-مشارکت
        required:[true,"وضعیت فروش یا اجاره الزامی است!"]
    },
    status_property:{
        type:String,
        enum:["residential","commercial","villa","land"],//مسکونی-تجاری-ویلاباغ-زمین
        required:[true,"لطفا وضعیت ملک را وارد نمایید!"]
    },
    category_property:{
        type:String,
        enum:["apartment","yard","shop","workplace","factory","underFloor","mall","officeBuilding"],
        //حیاط-آپارتمان//مغازه-دفترکار-کارخانه-زیرزمین-پاساژ-ساختمان اداری
    },
    
    apartmentType:{
        type:String,
        enum:["personal","complex","mall"],
        // required:[true,"لطفا نوع آپارتمان را وارد کنید!"]
    },
    address:{
        type:String,
        required:[true,"لطفا آدرس را وارد کنید!"]
    },
    space_under:Number, // زیربنا برای حیاط
    document_status:{
        type:String,
        enum:["sixDong","contractical","golname","ongoing"], //وضعیت سند: شش دانگ - قراردادی- قولنامه ای - در دست اقدام
        
    },
    geographical_position:{
        type:String,
        enum:["north","south","west","east","north-east","north-west","north-south","south-east","south-west","east-west","three-corners"],
        // شمالی - جنوبی-غربی-شرقی-شمالیشرقی-شمالیغربی-شماللجنوب-جنولشرق=جنوغرب-غربرق-سه نبش
    },
    whole_floor:Number, // کل طبقات ساختمان
    each_floor_unit:Number,//تعداد واحد در هر طبقه
    floor:Array, //طبقه
    room_count:Number, //تعداد اتاق
    
    urgent:{ //فوری 
        type:Boolean,
        default:false
    },
    changeable:{//قابل معاوضه
        type:Boolean,
        default:false
    },
    luxury:{//لوکس
        type:Boolean,
        default:false
    },
    ocasion:{//اوکازیون
        type:Boolean,
        default:false
    },
    balconi:{//بالکن
        type:Boolean,
        default:false
    },
    installations:{//نصبیات
        type:Boolean,
        default:false
    },
    view:{//چشم انداز
        type:Boolean,
        default:false
    },
    doublex:{//دوبلکس
        type:Boolean,
        default:false
    },
    singleUnit:{//تک واحدی
        type:Boolean,
        default:false
    },
    multiUnit:{//چند واحدی
        type:Boolean,
        default:false,
    },
    reBuild:{//چند واحدی
        type:Boolean,
        default:false,
    },
    //commercial
    space_balconi:Number, //متراژ بالکن
    space_underground:Number, //متراژ زیر زمین
    length_shop:Number, //طول دهنه
    widthOfYard:Number,//عرض قطعه
    //
    yardType:{
        type:String,
        enum:["concrete","steel","wooden"]
    },
    municipalityArea: { type: Number, default: null },
    elevator: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    Warehouse:{type:Boolean,default:false},
    
    // title: { type: String, required: true },
    description: { type: String, required: [true,"توضیحات خالی است."] },
    location:{
        type:{
            type:String,
            default:"Point"
        },
        coordinates:[Number]
    },
    passageArea:{//عرض گذر
        type:Number
    },
    status:
    { type: String, 
        enum: ["addedByCustomer", 'inProgressByRealtor','confirmedByRealtor',"confirmedByManager","legalCheck" ,'rejected',"ended","archived","recycleBin"], 
    },
    imageCover:String,
    images: [{ type: String }],
    // 
    legalCheck:{
        type:Boolean,
        default:false
    },
    updateLog: [{
        realtor:{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"},
        priceFrom:Number,
        priceTo:Number,
        depoisteFrom:Number,
        depositeTo:Number,
        rentFrom:Number,
        rentTo:Number,
        Date:Date
    }],
    //
    confirmNote: String,
    confirmedAt:{type:Date},
    confirmedByManager: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' },
    confirmedByRealtor:{type:mongoose.Schema.Types.ObjectId , ref:"Realtor"},
    //
    special: { type: Boolean, default: false },
    specialedAt: { type: Date },
    specialedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Realtor' },
    specialCommission:{
        type:String,
        required: [function(){
            return this.special ==true
        }, 'لطفا کمیسیون مربوط به قسمت ویژه را وارد کنید!']
    },
    // if added to divar web site
    addedToDivar:{
        type:Boolean,
        default:false
    },
    //
    // ended: { type: Boolean, default: false },
    //location information
    country:{type:mongoose.Schema.Types.ObjectId, ref:"Country"},
    state:{type: mongoose.Schema.Types.ObjectId, ref: 'State'},
    city:{type: mongoose.Schema.Types.ObjectId, ref: 'City'},
    area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: [true,"منطقه ملک را وارد کنید"] },//منطقه 
},{
    timestamps:true
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

propertySchema.index({updatedAt:1});
// creating a random number for code
propertySchema.pre("save",function(next){
    if(this.isNew){
        const random = Math.floor((Math.random()/10000000)*Date.now());
        this.code = random;
    }
    next();
});
// create a title for property
propertySchema.pre("save",async function(next){
    if(this.isNew){
        const statusSell = valueGrabber(tradeTypeArray,this.status_sell);
        // const statusProperty = valueGrabber(propertyTypeArray,this.status_property);
        const categoryProperty = valueGrabber(categoryPropertyArray,this.category_property);
        const area = await Area.findById(this.area);
        this.title = `${statusSell} ${categoryProperty} ${this.space} متری - ${area.name}`;
    }
    next();
})


const autoPopulateRealtors = function(next){
    this.populate({
        path:"listOfRealtors",
        select:"firstName lastName code photo"
    });
    next();
}

const autoPopulateLocation = function(next){
    this.populate("country").populate("state").populate("city").populate("area");
    next();
}

// propertySchema.pre(/^find/,autoPopulateRealtors);
// cant populate locations because of aggregation pipline
propertySchema.pre(/^find/,autoPopulateLocation);


propertySchema.plugin(auditPlugin);

const Property = mongoose.model("Property",propertySchema);

module.exports = Property;