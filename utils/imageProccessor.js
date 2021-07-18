const multer = require("multer");
const sharp = require("sharp");
const jimp = require("jimp");
const appError = require("./appError");


// multer storage
const multerStorage = multer.memoryStorage();
//filtering files that would be accepted
const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith("image")){
        cb(null,true);
    }else{
        cb(new appError("400","فایل ورودی باید تصویر باشد!"));
    }
}
const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

// each realtor have a profile image
exports.uploadRealtorImg = upload.single('imageCover');
// properties contain 1 cover iage and up to 10 images
exports.uploadPropertyImg = upload.fields([
    {name:'imageCover', maxCount:1},
    {name:'images',maxCount:10}
  ]);

// add watermark and resize to property images
exports.addWatermarkAndResize = async(req,res,next) => {
    
    if(!req.files){return next()};
    if(!req.files.imageCover || !req.files.images) return next();
    const imageCoverFilename = `melketabriz.com-${req.body.code}-${Date.now()}-cover.jpeg`;
    // add watermark to images
    let watermarkImg = await jimp.read('./public/logo/logo.png');
    const imageCover = await jimp.read(req.files.imageCover[0].buffer);
    await watermarkImg.resize(imageCover.bitmap.width/10,jimp.AUTO);
    await imageCover.composite(watermarkImg,(imageCover.bitmap.width/2 - watermarkImg.bitmap.width/2),(imageCover.bitmap.height/2 - watermarkImg.bitmap.height/2),{
        mode: jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.5
      }).quality(72);
    
    await imageCover.write(`public/img/propertyImg/${imageCoverFilename}`);

    
    //add filename to req.body 
    req.body.imageCover = imageCoverFilename;

    //working on another images
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async(file,i) => {
            const filename = `melketabriz.com-${req.body.code}-${Date.now()}-${i+1}.jpeg`;
            let image = await jimp.read(file.buffer);
            await watermarkImg.resize(imageCover.bitmap.width/10,jimp.AUTO);
            await image.resize(500,450).composite(watermarkImg,(image.bitmap.width/2 - watermarkImg.bitmap.width/2),(image.bitmap.height/2 - watermarkImg.bitmap.height/2),{
                mode: jimp.BLEND_SOURCE_OVER,
                opacityDest: 1,
                opacitySource: 0.5
              }).quality(72);
            await image.write(`public/img/propertyImg/${filename}`);
        // add string to req.body.files
        req.body.images.push(filename);
        })
    )
    next();
}

//resize images of realtors
exports.resizeImg = async(req,res,next) => {
    if(!req.file){
        return next();
    }
    const filename = `melkeTabriz.com-${req.realtor._id}-${Date.now()}-RealtorImg.jpeg`
    await sharp(req.file.buffer)
                .resize(400,400)
                .toFormat("jpeg")
                .jpeg({quality:90})
                .toFile(`public/img/realtorImg/${filename}.jpeg`);
    
    /// add string to body
    req.body.imageCover = filename;
    next();
}




