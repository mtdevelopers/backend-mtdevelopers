const catchAsync = require("../../utils/catchAsync");
const appError = require("../../utils/appError");
const Property = require("../../model/propertyModel/propertyModel");
const mongoose = require("mongoose");
const RequsetProperty = require("../../model/propertyModel/requestPropertyModel");


// this function recieves 
// sortyType ["createdAt","updatedAt"]
// groupBy ["status","status_property","category_property"]
// Date 2021-06-03To2022-03-01
// country state city area
exports.getPropertyStats = (Model) => {
    return catchAsync(async(req,res,next) => {
    
    if(!req.query.groupBy){
        return next(new appError(400,"آمار بر چه اساس برای شما به نمایش گذاشته شود!"))
    }
    // recieve Date and realtor and location from query
    if(!req.query.Date){
      return next(new appError(400,"لطفا تاریخ را وارد نمایید!"));
    }
    const date = req.query.Date;
    const dateFrom = new Date(date.split("To")[0]);
    const dateTo = new Date(date.split("To")[1]);
    /////////////////////////////////////////////
    


    let realtorObject = {};
    let countryObject = {};
    let stateObject = {};
    let cityObject = {};
    let areaObject = {};
    /////////////////////////////////////////////
    // check all the fields and restricet the user
    if(req.check){
        if(req.query.ownRealtor){
            // if realtor can access own stats
            realtorObject = { createdByRealtor : req.realtor._id};
        }else if(req.query.realtorArr){
            //if realtor can access list of realtors stats
            const realtorIdArr = req.query.realtorArr.map(el => String(el._id));
            // if user enters one realtor 
            if(typeof req.query.realtor === "string"){
                if(realtorIdArr.indexOf(req.query.realtor) !== -1){
                    const realtorId = mongoose.Types.ObjectId(req.query.realtor);
                    realtorObject = {createdByRealtor: realtorId}
                }else{
                    return next(new appError(401,"نمی توانید به آمار این مشاور دسترسی داشته باشید!"))
                }
            // if user enters multiple realtors
            }else if(typeof req.query.realtor === "object"){
                const allowedRealtor = realtorIdArr.filter(realtor => req.query.realtor.indexOf(realtor) !== -1);
                const allowedRealtorId = allowedRealtor.map(id => mongoose.Types.ObjectId(id));
                realtorObject = {createdByRealtor: {$in:allowedRealtorId}};
            // if user dont enter any realtor search between all the realtors of user
            }else{
                const realtorArr = req.query.realtorArr.map(element => element._id);
                realtorObject = {createdByRealtor : {$in:realtorArr}};
            }
        }
        
        // if realtor can access all no need to match by this field
        /////////////////////////////////////////////
    // country check
        if(req.query.country){
            if(typeof req.query.country === "string"){
                if(req.realtor.country.indexOf(req.query.country) !== -1){
                    const countryId = mongoose.Types.ObjectId(req.query.country);
                    countryObject = {country:countryId};
                }else{
                    return next(new appError(401,"امکان دسترسی به آمار این کشور وجود ندارد!"))
                }
            }else{
                const allowedCountry = req.realtor.country.filter(country => req.query.country.indexOf(String(country._id)))
                // const countryArr = req.query.country.map(id => mongoose.Types.ObjectId(id));
                countryObject = {country:{$in:allowedCountry}};
            }
        }
    //state check
        if(req.query.state){
            if(typeof req.query.state === "string"){
                if(req.realtor.state.indexOf(req.query.state) !== -1){
                    const stateId = mongoose.Types.ObjectId(req.query.state);
                    stateObject = {state:stateId}
                }else{
                        return next(new appError(401,"امکان دسترسی به آمار این استان وجود ندارد!"))
                }
            }else{
                const allowedState = req.realtor.state.filter(state => req.query.state.indexOf(String(state._id)));
                stateObject = {state:{$in:allowedState}}
            }
        }
    // city check
        if(req.query.city){
            if(typeof req.query.city === "string"){
                if(req.realtor.city.indexOf(req.query.city) !== -1){
                    const cityId = mongoose.Types.ObjectId(req.query.city);
                    cityObject = {city:cityId}
                }else{
                    return next(new appError(401,"امکان دسترسی به آمار این شهر وجود ندارد!"))
                }
            }else{
                const allowedCity = req.realtor.city.filter(city => req.query.city.indexOf(String(city._id)))
                cityObject = {city:{$in:allowedCity}}
            }
        }
    // area check        
        if(req.query.area){
            if(typeof req.query.area === "string"){
                if(req.realtor.area.indexOf(req.query.area) !== -1){
                    const areaId = mongoose.Types.ObjectId(req.query.area);
                    areaObject = {area:areaId}
                }else{
                    return next(new appError(404,"نمی توانید به آمار این منطقه دسترسی داشته باشید!"))
                }
            }else{
                const allowedArea = req.realtor.area.filter(area => req.query.area.indexOf(String(area._id)));
                areaObject = {area:{$in:allowedArea}};
            }
        }
    }else{
        // no need to check realtor information just response with result
        if(req.query.realtor){
            if(typeof req.query.realtor === "string"){
                const realtorId = mongoose.Types.ObjectId(req.query.realtor);
                realtorObject = { createdByRealtor : realtorId};
            }else{
                const realtorArr = req.query.realtor.map(id => mongoose.Types.ObjectId(id));
                realtorObject = {createdByRealtor:{$in:realtorArr}}
            }
        }
        if(req.query.country){
            if(typeof req.query.country === "string"){
                const countryId = mongoose.Types.ObjectId(req.query.country);
                countryObject = {country:countryId};
            }else{
                const countryArr = req.query.country.map(id => mongoose.Types.ObjectId(id));
                countryObject = {country:{$in:countryArr}};
            }
        }
        if(req.query.state){
            if(typeof req.query.state === "string"){
                const stateId = mongoose.Types.ObjectId(req.query.state);
                stateObject = {state:stateId}
            }else{
                const stateArr = req.querycity.map(id => mongoose.Types.ObjectId(id));
                stateObject = {state:{$in:stateArr}}
            }
        }
        if(req.query.city){
            if(typeof req.query.city === "string"){
                const cityId = mongoose.Types.ObjectId(req.query.city);
                cityObject = {city:cityId}
            }else{
                const cityArr = req.query.city.map(id => mongoose.Types.ObjectId(id));
                cityObject = {city:{$in:cityArr}}
            }
        }
        if(req.query.area){
            if(typeof req.query.area === "string"){
                const areaId = mongoose.Types.ObjectId(req.query.area);
                areaObject = {area:areaId}
            }else{
                const areaArr =req.query.arera.map(id => mongoose.Types.ObjectId(id));
                areaObject = {area:{$in:areaArr}};
            }
        }
        
    }
    


    const propertyStats = await Model.aggregate([

        // Date match
        {$match:{
            createdAt:{
                $gte: dateFrom,
                $lte: dateTo
            } 
        }},
        //realtor match
        {$match:realtorObject},
        // Country match
        {$match:countryObject},
        //state match
        {$match:stateObject},
        //city match
        {$match:cityObject},
        // area match
        {$match:areaObject},
    
    
        // group phase
        {$group:{_id:`$${req.query.groupBy}`,count:{$sum:1}}}
  
    ])
    
    res.status(200).json({
      status:"success",
      propertyStats
    })
    
  })};



  
  // //geospatial functionality
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
        properties,
    });
  });
  
  
  
  
  