const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const auditPlugin = require("../../utils/auditPlugin");

const SALT_WORK_FACTOR = 10;


const realtorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'لطفا نام خود را وارد کنید!'],
  },
  code: {
    type: Number,
    unique: true,
    required:[true,"کد شناسایی مشاور را وارد کنید!"]
  },
  lastName: {
    type: String,
    required: [true, 'لطفا نام خانوادگی را وارد کنید'],
  },
  father_name: {
    type: String,
    required: [true, 'فیلد نام پدر ضروری است'],
  },
  address: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  has_married: {
    type: Boolean,
    default: true,
  },
  mobileNumber: {
    type: Number,
    required: [true, 'لطفا شماره تلفن همراه خود را بدون صفر وارد کنید'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'رمز عبور را وراد کنید'],
    select:false
  },
  confirmPassword:{
      type:String,
      reqired:[true,"تکرار رمز عبور خالی است"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'رمز عبور و تکرار رمز عبور یکسان نیست',
    }
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  otp:{
    type:String
  },
  national_code: {
    type: String,
    required: [true, 'کد ملی را وارد کنید'],
    unique: true,
  },
  phone: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
  },
  biography:String, //bio 
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  organizationPosition:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"OrganizationPosition"
  },
  documents: {
    type: Object,
  },
  state:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"State",
  }],
  country:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Country"
  }],
  city:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"City",
  }],
  area:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Area",
  }],
  workplace:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Workplace",
  },
  sellCompletion:{
    type:Number,
    default:0
  },
  imageCover:String,
  headRealtor:{type:mongoose.Schema.Types.ObjectId,ref:"Realtor"}
  
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}
,{timestamps: true});


realtorSchema.virtual("realtorsList",{
  ref:"Realtor",
  localField:"_id",
  foreignField:"headRealtor"
});

const autoPopulateRealtorList = function(next) {
  this.populate("realtorsList");
  next();
}

//auto populate realtor role 
const autoPopulateRealtorRole = function(next) {
  this.populate({
    path:"role"
  }).populate({
    path:"organizationPosition"
  });
  next();
}

const autoPopulateLocation = function(next){
  this.populate("country").populate("state").populate("city").populate("area").populate("line").select("title");
  next();
}



realtorSchema.pre(/^find/,autoPopulateRealtorRole);
// realtorSchema.pre(/^find/,autoPopulateRealtorList);
// realtorSchema.pre(/^find/,autoPopulateLocation);



realtorSchema.pre('save', async function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // encrypt password 
  user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
  // clear confirm Pssword
  user.confirmPassword = undefined;
  next();
});

realtorSchema.methods.comparePassword = async function (candidatePassword, savedPassword) {
  return await bcrypt.compare(candidatePassword, savedPassword);
};

//generating a random token for reset password functionality
realtorSchema.methods.createPasswordResetToken = function(){
//create 32charachter random token
const resetToken = crypto.randomBytes(32).toString('hex');

//encrypt reset token and create a new field in schema to store it
this.passwordResetToken = crypto
                                .createHash('sha256')
                                .update(resetToken)
                                .digest('hex');


//set password reset expires time for exaple 10 min
this.passwordResetTokenExpires = Date.now() + 10*1000*60;

//send plaintext of token to the user via sms
return resetToken;
}



realtorSchema.plugin(uniqueValidator, {message: 'کاربری با این اطلاعات وجود دارد'});
realtorSchema.plugin(auditPlugin);

const Realtor = mongoose.model('Realtor', realtorSchema);

module.exports = Realtor;
