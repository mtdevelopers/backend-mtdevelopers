const sharp = require('sharp');
const multer = require('multer');
const Property = require('../../model/propertyModel/propertyModel');
const factory = require('../factory/crmFunctionFactory');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const User = require('../../model/userRelatedModels/userModel');
const Realtor = require('../../model/realtorRelatedModel/realtorModel');
const appError = require('../../utils/appError');
const City = require("../../model/cityModel");


// const matchObjectCreator = (locationStr,locatinId) => {
//   switch (locationStr) {
//     case "country":
//       return {country : locatinId}
//     case "state":
//       return {state : locatinId};
//     case "city":
//       return {city : locatinId};
//     case "area":
//       return {area : locatinId};
//     case "line":
//       return {line : locatinId};
  
//   }
// }




const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(' فقط می توانید تصویر را آپلود کنید', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadHouseImg = upload.fields([
  {name:'imageCover', maxCount:1},
  {name:'images',maxCount:10}
]);
exports.resizeHouseImage = catchAsync(async(req,res,next) => {
  if(!req.files.imageCover || !req.files.images) return next();
  const imageCoverFilename = `melkeTabriz-${req.params.id}-${Date.now()}-cover.jpeg`;
  //processing cover image
  await sharp(req.files.imageCover[0].buffer)
    .resize(1000, 1000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/propertyImg/${imageCoverFilename}`);
    //adding imageCover name to the req.body
    //to send it to next middleware
    req.body.imageCover = imageCoverFilename;
  //processing images
  req.body.images =[];
  await Promise.all(
    req.files.images.map(async(file,i) => {
      const filename = `melkeTabriz-${req.params.id}-${Date.now()}-${i+1}.jpeg`;
      await sharp(file.buffer)
      .resize(1000, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/propertyImg/${filename}`);
      
    req.body.images.push(filename);
  })
  );
  next();
});




// get all property based on query
exports.getAllProperty = factory.getAll(Property,{identifier:"property"},{path:"customer",select:"firstName lastName mobileNumber"});

//getOne takes a model and populate options
exports.getOneProperty = factory.getOne(Property, { id:"propertyId"},{path:"listOfRealtors"});
exports.createOneProperty = factory.createOne(Property,{identifier:"property"});
exports.updateOneProperty = factory.updateAndSave(Property,{id:"propertyId",identifier:"property"});
exports.deleteOneProperty = factory.deleteOne(Property,{id:"propertyId",identifier:"property"});

exports.getNeedToUpdate = (req,res,next) => {
  const fortyFive = 45 * 24 * 60 * 60 * 1000;
  const fortyFiveDayAgo = new Date(Date.now()- fortyFive);
  req.query.updatedAt = {"lte" : fortyFiveDayAgo };
  next();
}


exports.getMyProperties = (req,res,next) => {
  req.query.createdByRealtor = req.realtor._id;
  next();
}

exports.canSeeMidlleware = (req,res,next) => {
      req.query.status={$in:req.realtor.role.propertyStatusCanSee}
      next();
};

/// waiting for confirmation middleware
exports.waitingForConfirm = (req,res,next) => {
  if(!req.realtor.role.roleType){
    return next(new appError(401,"نوع نقش شما مشخص نیست!"))
  }
  switch (req.realtor.role.roleType) {
    case "realtor":
      req.query.status = { $in : ["addedByCustomer"]}
      req.query = {$or:[req.query,{inProgressByRealtor : req.realtor._id},{confirmedByRealtor : req.realtor._id}]}
      return next();
    case "manager":
      req.query.status = { $in : ["addedByCustomer","confirmedByRealtor"]}
      req.query = {$or:[req.query,{inProgressByRealtor : req.realtor._id}]}
      return next();
    case "legalDeputy":
      req.query.status = { $in : ["legalCheck"]}
      req.query = {$or:[req.query,{inProgressByRealtor : req.realtor._id}]}
      return next();
    case "head-Manager":
      req.query.status = { $in: ["addedByCustomer","confirmedByRealtor","legalCheck"]}
      req.query = {$or:[req.query,{inProgressByRealtor : req.realtor._id}]}
      return next();
    default:
      return next(new appError(401,"نوع نقش شما تعریف نشده است!"))
  }
}






