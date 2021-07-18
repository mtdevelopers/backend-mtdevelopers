const Realtor = require("../../model/realtorRelatedModel/realtorModel");
const appError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const JWT = require("jsonwebtoken");
const {promisify} = require("util");
const crypto = require("crypto");
const smsCreator = require("../../utils/sendSms");
const Audit = require("../../model/auditModel");


// creating one time pad password for authentication
// const createOTP = () => {
//     const digits = '0123456789';
//     let OTP = '';
//     for (let i = 0; i < 4; i++ ) {
//         OTP += digits[Math.floor(Math.random() * 10)];
//     }
//     return OTP;
// }
// send OtP by sms
const sendSms = (mobileNumber,password) => {
    smsCreator.sendSmsByTemplate(mobileNumber, '12439', [{ 'Parameter': 'password', 'ParameterValue': password }])
}



// create JWT for user
const createJWT = (id) => {
    return JWT.sign({id},process.env.SECRET_JWT,{
        expiresIn:process.env.EXPIRATION_JWT
    });

}

// create and send jwt to user
const createAndSendToken = (user,res) => {
    const token = createJWT(user._id);
    // set cookie options
    const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.EXPIRATION_JWT_COOKIE * 24 * 60 * 60 * 1000
        ),
        secure:process.env.NODE_ENV === 'production' ? true:false,
        httpOnly: true
        };
        
        res.cookie('jwt', token, cookieOptions);
        user.password = undefined;
        res.status(201).json({
            status: 'success',
            token,
            user
        });
    // res.status(201).json({
    //     status: 'success',
    //     token,
    //     user
    // });

}
////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
exports.signUp = catchAsync(async(req,res,next) => {
    const newRealtor = await Realtor.create({
        firstName:req.body.firstName,
        code:req.body.code,
        lastName:req.body.lastName,
        father_name:req.body.father_name,
        mobileNumber:req.body.mobileNumber,
        password:req.body.password,
        confirmPassword: req.body.confirmPassword,
        national_code:req.body.national_code,
        role:req.body.role
    });
    await Audit.create({
        action:"signUp realtor",
        realtor:newRealtor._id,
        createdBy:{firtstName:req.body.firstName,lastName:req.body.lastName}

    });
    createAndSendToken(newRealtor,res);
})


exports.logIn = catchAsync(async(req,res,next) => {
    const {mobileNumber,password} = req.body;
    //check if the realtor exist
    if(!mobileNumber || !password){
        return next(new appError("400","لطفا شماره تلفن همراه و رمز عبور خود را وارد نمایید!"))
    }
    // find realtor and grab password
    const realtor = await Realtor.findOne({mobileNumber}).select("+password");
    // if cant find 
    if(!realtor){
        return next(new appError("404","اطلاعات کاربر یافت نشد!"))
    }
    // verify password by schema methods
    const verification = await realtor.comparePassword(password,realtor.password);
    if(!verification){
        return next(new appError("404","رمز عبور صحیح نمی باشد!"));
    }
    await Audit.create({
        action:"login realtor",
        realtor:realtor._id,
        createdBy:{firstName:realtor.firstName,lastName:realtor.lastName}

    });
    // create an otp send it to client nd sav it data base
    createAndSendToken(realtor,res);
    
    
});
//check otp
exports.checkVerificationCode = async(req,res,next) => {
    res.status(201).json({
        status:"success",
        message:"this route is not implemented yet"
    })
}
//resend token
exports.resendToken = catchAsync(async(req,res,next) => {
    res.status(200).json({
        status:"success",
        message:"this route is not implemented yet"
    })
});





// checking jwt on cookies for access data
exports.isLoggedIn = async (req, res, next) => {
  
    if (req.cookies.jwt) {
        try {
            //verify token
            const decoded = await promisify(JWT.verify)(
                req.cookies.jwt,
                process.env.SECRET_JWT
            );
            
            //check if user still exists
            const currentRealtor = await Realtor.findById(decoded.id);
            if (!currentRealtor) {
                return next();
            }
            
            // 
            res.locals.realtor = currentRealtor;
            req.body.realtor = currentRealtor;
            return next();
        }catch (err){
            return next();
        }
        }
    next();
};

exports.logOut = (req,res,next) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        secure:process.env.NODE_ENV === 'production' ? true:false,
        httpOnly: true
    });
    res.status(200).json({
      status: 'success',
    });
}



exports.forgetPassword = catchAsync(async(req,res,next) =>{
    //get user based on email
    const realtor = await Realtor.findOne({code: req.body.code})
    
    if(!realtor){
      return next(new appError("404","cant find such a realtor")); 
    }
    //generate random token by mongoose methods
    const resetToken = realtor.createPasswordResetToken();
    //hala baraye ink passwordtoken va passwordTokenExpires k ba methode bala ijad mishe
    //ro daxele DB save konim baraye inkar bayad hameye validatorhaye DB ro gheyre faal konim
    await realtor.save({validateBeforeSave:false});
  
    //send token back to user via email
    //server should send a reset url to the client 
    //url contains reset token
    
    //sending SMS
    try{
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/realtor/resetpassword/${resetToken}`;
      // await smsCreator(realtor.mobileNumber,resetURL);
      res.status(200).json({
        status: 'success',
        message: `token send to email ${resetURL}`, // for test
      });
    }catch(err){
      realtor.passwordResetToken = undefined;
      realtor.passwordResetTokenExpires=undefined;
      await realtor.save({validateBeforeSave:false});
      return next(new appError(err.message,500))
    }
    
  
  });
  exports.resetPassword =catchAsync(async(req,res,next) =>{
    //1-get user based on token
    //darvaghe oon tokeni k daste user hast(req.params.token) ro
    //ba tokeni k daxele DB hast bayad moghayese konim
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
      //mongoDB find method takes two argument one is for query asn second for projection
    const realtor = await Realtor.findOne({ 
        passwordResetToken: hashedToken ,
        passwordResetTokenExpires: { $gt:Date.now()} 
    });
    //2-if token has not expired and user exist
    if (!realtor)
      return next(new appError('توکن احراز هویت را مجددا وارد نمایید!', 400));
    //set new password
    realtor.password = req.body.password;
    realtor.confirmPassword = req.body.confirmPassword;
    realtor.passwordResetTokenExpires = undefined;
    realtor.passwordResetToken = undefined;
    await realtor.save(); //mixaim k inja validate she vac hamin off nakardim
  
  
    //4-log the user in send yoken to the client
    createAndSendToken(realtor,res);
    
  })
  
  //updating password when the users want
  exports.updatePassword = catchAsync(async(req,res,next) => {
    //1-get user from DB
    // user must be logged in so req object contains req.realtor
    const realtor =  await Realtor.findById(req.realtor._id).select('+password');
    
    //2-check if posted password is correct
    //compare user entered password vs. DB saved password
    if(!await realtor.comparePassword(req.body.passwordCurrent,realtor.password)){
      return next(new appError('رمز عبور نامعتبر است!', 401));
    }
    //3 update password
    realtor.password = req.body.password;
    realtor.confirmPassword = req.body.confirmPassword;
    await realtor.save();
  
    //4-log in user --- send token to the user
    createAndSendToken(realtor,res);
  });



  
exports.protectRoute = catchAsync(async(req,res,next) => {
    let token = null;
    // find jwt token
    if(req.headers.authorization){
        if(req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }else{
            return next(new appError("404","شما قادر به ورود نیستید!"))
        }
        
    }else if(req.cookies.jwt){
        token = req.cookies.jwt
    }else{  
        return next(new appError("401","شما وارد نشدید!"));
    }
    // verify token
    //JWT.verify will result id iat and exp 
    // eg ==> { id: '60ae249b34755904a4421ecd', iat: 1622025386, exp: 1622068586 }
    const decodeToken = await promisify(JWT.verify)(token,process.env.SECRET_JWT);
    // find a realtor or a user
    var logedInRealtor = await Realtor.findById(decodeToken.id).populate("realtorsList");
    if(!logedInRealtor){
        next(new appError("404","اطلاعات مورد نیاز برای احراز هویت یدا نشد."))
    }
    req.realtor = logedInRealtor;


    next();
})


