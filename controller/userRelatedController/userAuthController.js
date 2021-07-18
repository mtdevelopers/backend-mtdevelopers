const User = require("../../model/userRelatedModels/userModel");
const appError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const JWT = require("jsonwebtoken");
const {promisify} = require("util");
const smsCreator = require("../../utils/sendSms");
const Property = require("../../model/propertyModel/propertyModel");
const RequestProperty = require("../../model/propertyModel/requestPropertyModel");


// creating one time pad password for authentication
const createOTP = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
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
    

}

exports.logIn = catchAsync(async(req,res,next) => {
    if(!req.body.mobileNumber){
        return next(new appError("404","لطفا شماره تلفن همراه خود را وارد نمایید!"))
    }
    // find user
    const user = await User.findOne({mobileNumber:req.body.mobileNumber});
    
    if(user && user.blocked){
        return next(new appError("500", "کاربر در لیست سیاه قرار گرفته است!"));
    }
//////////////////////////////////////////////////////////
    // 1- create otp 
    const password = createOTP();
/////////////////////////////////////////////

    // check if the user exist in database
    if(!user){
        //create new user
        //  send otp to user via sms 
        // sendSms(req.body.mobileNumber,password);
        const newUser = await User.create({
            mobileNumber:req.body.mobileNumber,
            password:password,
            passwordExpiresAt: Date.now() + 5*1000*60

        });
        res.status("201").json({
            status:"success",
            message:`رمز یکبار مصرف از طریق پیامک ارسال شد! ${password}`

        })
    }else{
        // find user by id and update it
        // 2- send otp to user via sms 
        // sendSms(user.mobileNumber,password);       
        const updatedUser = await User.findByIdAndUpdate(user._id,{
            password:password,
            passwordExpiresAt: Date.now() + 5*1000*60
        });
        res.status("201").json({
            status:"success",
            message:`رمز یکبار مصرف از طریق پیامک ارسال شد! ${password}`

        })
    }
    
});

//resend token
exports.resendToken = catchAsync(async(req,res,next) => {
    const user = await User.findOne({mobileNumber:req.params.mobileNumber});
    if(!user){
        return next(new appError("404","کاربر یافت نشد!"));
    }
    const password = createOTP();
    // find user by id and update it
    
    // sendSms(user.mobileNumber,password);    
    const updatedUser = await User.findByIdAndUpdate(user._id,{
        password:password,
        passwordExpiresAt: Date.now() + 5*1000*60
    });
    res.status("201").json({
        status:"success",
        message:`رمز یکبار مصرف از طریق پیامک ارسال شد! ${password}`

    })
});

exports.checkVerificationCode = async(req,res,next) => {
    // find user
    const mobileNumber = req.params.mobileNumber;
    const {otp} = req.body;
    // if there isnt mobile number or otp
    if(!mobileNumber || !otp){
        return next(new appError("400","لطفا رمزیکبار مصرف را وراد نمایید!"));
    }
    const user = await User.findOne({mobileNumber}).select("+password");
    if(!user){
        return next(new appError("404","کاربر یافت نشد!"))
    }
    //check expiration date
    if(user.passwordExpiresAt < Date.now()){
        return next(new appError("404","توکن منقضی شده است!"));
    }

    //verify OTP that user entered and password that saved in DB
    if(!await user.verifyOTP(user.password,otp)){
        return next(new appError("404","رمز یکبار مصرف را با دقت وارد نمایید!"))
    }

    //create a JWT and send it to user
    createAndSendToken(user,res);
   

}



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
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            
            // 
            res.locals.user = currentUser;
            req.body.user = currentUser;
            return next();
        }catch (err){
            return next();
        }
        }
    return next();
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
    var logedInUser = await User.findById(decodeToken.id);
    if(!logedInUser){
        return next(new appError("404","اطلاعات مورد نیاز برای احراز هویت یدا نشد."))
    }
    req.user = logedInUser;
  
    return next();
})
exports.authorization = catchAsync(async(req,res,next) => {
    const userId = req.user._id; // grab from authentication
    
    const objectId = req.params.propertyId; //grab from the url    

    // check if the property belongs to the user
    const property = await Property.findById(objectId);

    if(!property){
        return next(new appError("404","آگهی یافت نشد!"));
    }
    
    if(String(property.createdByCustomer) !== String(userId)){
        return next( new appError("401","مجاز به انجام این تراکنش نمی باشید!"))
    }
    return next();
    
})
exports.authorizationForRequest = catchAsync(async(req,res,next) => {
    const userId = req.user._id;
    const ObjectId = req.params.requestpropertyId;

    const requestProperty = await RequestProperty.findById(ObjectId);

    if(!requestProperty){
        return next(new appError("404","آگهی یافت نشد!"));
    }
    if(String(requestProperty.createdByCustomer) !== String(userId)){
        return next(new appError("401","مجاز به انجام این تراکنش نمی باشید!"))
    }
    return next();
})

