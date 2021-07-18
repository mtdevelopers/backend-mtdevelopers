const catchAsync = require("../../utils/catchAsync");
const appError = require("../../utils/appError");
const Realtor = require("../../model/realtorRelatedModel/realtorModel");
const factory = require("../factory/crmFunctionFactory");

///filtering properties that user allowed to update himself
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach( el => {
      if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj;
}



// realtor can update his/her information
exports.updateMe = catchAsync(async(req,res,next) => {
    //check if realtor wants to update password from this route
    if(req.body.password || req.body.confirmPassword){
        return next(new appError("401","use /updatepassword route for updating password"));
    }
    // allow all fileds unless password confirm password and role or another fildes that user cant update himself
    // user is loged in so req obj contains realtor id
    const allowedFields = ["firstName","lastName","mobileNumber","imageCover"];
    console.log(req.body);
    const filteredBody = filterObj(req.body,...allowedFields);
    const updatedRealtor = await Realtor.findByIdAndUpdate(req.realtor._id,filteredBody,{new:true,runValidators:true});
    res.status(201).json({
        status:"success",
        updatedRealtor
    })
});

// realtor can disactive him/herself
exports.deleteMe = catchAsync(async(req,res,next) => {
    await Realtor.findByIdAndUpdate(req.realtor._id,{active:false})
    res.status(204).json({
        status:"success",
        
    })
})

//////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//////////////////////////Admin routes///////////////////////////////////////

//list all realtors
exports.getAllRealtor = factory.getAll(Realtor,{identifier:"realtor"});

//create a realtor by admin 
exports.createOneRealtor = factory.createOne(Realtor,{identifier:"realtor"});

// list one realtor
exports.getOneRealtor = factory.getOne(Realtor,{id:"realtorId"});

//update one raltor
exports.updateOneRealtor = factory.updateOne(Realtor,{identifier:"realtor",id:"realtorId"});

// delete one realtor
exports.deleteOneRealtor = factory.deleteOne(Realtor,{identifier:"realtor",id:"realtorId"});
