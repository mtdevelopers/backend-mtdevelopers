const User = require("../../model/userRelatedModels/userModel");
const catchAsync = require("../../utils/catchAsync");



exports.updateMe = catchAsync(async(req,res,next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id,{
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        gender:req.body.gender,
        birthDate:req.body.birthDate,
        isRealtor:req.body.isRealtor,
        job:req.body.job,
        photo:req.body.photo,
        country:req.body.country,
        state:req.body.state,
        city:req.body.city,
        area:req.body.area
    },{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:"success",
        updatedUser
    })
})

exports.deleteMe = catchAsync(async(req,res,next) => {
    await User.findByIdAndUpdate(req.user._id,{active:false});
    res.status(204).json({
        status:"success",
    })
})



