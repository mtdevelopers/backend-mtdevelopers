const mongoose = require('mongoose');
// const validate = require('mongoose-validator');
// const uniqueValidator = require('mongoose-unique-validator');
const auditPlugin = require("../utils/auditPlugin");


const workplaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'محل کار دارای نام است!'],
  },
  postal_code: {
    type: Number,
    required: true,
    validate: {
      validator(v) {
        return /^\d{10,10}$/.test(v);
      },
      message: 'کد پستی فقط شامل اعداد می شود!',
    },
  },
  address: {
    type: String,
    required: [true, 'آدرس محل کار وارد نشده است!'],
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, 'استان وارد نشده است!'],
  },
  location:{
    type:{
        type:String,
        default:"Point"
    },
    coordinates:[Number]
},
  city:{type:mongoose.Schema.Types.ObjectId,ref:"City",required:[true,"این شعبه در کدام شهر قرار دارد!"]},
  

},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}, { timestamps: true });

// workplaceSchema.virtual("areas",{
//   ref:"Area",
//   localField:"_id",
//   foreignField:"area"
// });

// workplaceSchema.pre(/^find/,function(next){
//   this.populate("lines");
//   next();
// })

workplaceSchema.virtual("listOfRealtors",{
  ref:"Realtor",
  localField:"_id",
  foreignField:"workplace"
});

workplaceSchema.plugin(auditPlugin);
const Workplace = mongoose.model('Workplace', workplaceSchema);

module.exports = Workplace;
