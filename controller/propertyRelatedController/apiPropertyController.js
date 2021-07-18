const sharp = require('sharp');
const multer = require('multer');
const Property = require('../../model/propertyModel/propertyModel');
const factory = require('../factory/functionFactory');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const User = require('../../model/userRelatedModels/userModel');
const Realtor = require('../../model/realtorRelatedModel/realtorModel');
const appError = require('../../utils/appError');


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


exports.getMyProperties = (req,res,next) => {
  req.query.createdByCustomer = req.user._id;
  next();
}

exports.getConfirmedProperty = (req,res,next) => {
  req.query.status = "confirmedByManager";
  next();
}
exports.getSpecialProperty = (req,res,next) => {
  req.query.special = true,
  next();
}
// get all property based on query
exports.getAllProperty = factory.getAll(Property);

//getOne takes a model and populate options
exports.getOneProperty = factory.getOne(Property, { id:"propertyId"},{path:"listOfRealtors" ,select:"firstName lasName mobileNumber"});
exports.createOneProperty = factory.createOne(Property,{identifier:"property"});
exports.updateOneProperty = factory.updateOne(Property,{id:"propertyId"});
exports.deleteOneProperty = factory.deleteOne(Property,{id:"propertyId"});




// //geodpatial functionality
// //'/house-within/:distance/center/:latlng/unit/:unit'
exports.findNearProperties = catchAsync(async (req, res, next) => {
  const {distance, latlng, unit} = {...req.params};
  const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1;
  const [lat,lng] = latlng.split(',');
  
  if(!lat || !lng) 
  return next(new AppError('لطفا مختصات جغرافیایی را بصورت lat و lng وارد کنید.',400));
  //geospatial find method
  const properties = await Property.find({
    location:{
      $geoWithin:{
        $centerSphere:[[lng,lat],radius]
      }
    }
  });
  res.status(200).json({
    status: 'success',
    data: {
      properties,
    },
  });
});
