const appError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const SearchQueryFeatures = require("../../utils/searchQueryFeatures");


// creating a filter object to pass in to the query
const filterCreator = (params) => {
    let filter = {};
    if(params.userId){
        filter = {createdByCustomer:params.userId}
    }
    if(params.realtorId){
        filter = {...filter, realtor:params.realtorId}
    }
    if(params.stateId){
        filter = {...filter , state:params.stateId}
    }
    if(params.cityId){
        filter = {...filter, city:params.cityId}
    }
    if(params.areaId){
        filter = {...filter, area:params.areaId}
    }
    if(params.lineId){
        filter = {...filter, line:params.lineId}
    }
    if(params.workplaceId){
        filter = {...filter, workplace:params.workplaceId}
    }
    return filter;
}
//grab id from req.params
const grabId = (id,paramsObject) => {
    return paramsObject[id];
}
// get one document by id
// grabs model 
exports.getOne = (Model,options,popOptions) => 
    catchAsync(async(req,res,next) =>{
        const objectId = grabId(options.id,req.params);
        let query = Model.findById(objectId);
        if(popOptions) query = query.populate(popOptions);
        const data = await query;
        res.status(200).json({
            status: "success",
            data
        })
    });
;


exports.getAll = (Model) => 
    catchAsync(async(req,res,next) => {
        // check req. params to filter by params
        const filter = filterCreator(req.params);
        // create an instance of class search query
        
        const features = new SearchQueryFeatures(Model.find(filter),req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // execute query
        const data = await features
            .query;

            res.status(200).json({
            status: "success",
            count:data.length,
            data
        })
    });


exports.createOne = (Model,options) => 
    catchAsync(async(req,res,next) => {
        if(options && (options.identifier === "property" || "requestedProperty")){
            req.body.createdByCustomer = req.user._id;
            req.body.status = "addedByCustomer";
            req.body.creator = "customer"
        }
        const data = await Model.create(req.body);
        res.status(200).json({
            status: "success",
            data
        })
    });

exports.updateOne = (Model,options) =>
    catchAsync(async(req,res,next) => {
        // country/:counryId //his function created for nested Routes
        const objectId = grabId(options.id,req.params);
        if(options && (options.identifier === "property" || "requestedProperty")){
            req.body.status = "addedByCustomer";
        }
        // check if the property belongs to the user
        const data = await Model.findByIdAndUpdate(objectId,req.body,{
            runValidators:true,
            new:true
        }); 
        res.status(200).json({
            status: "success",
            data
        })
    })

exports.deleteOne = (Model,options) => 
    catchAsync(async(req,res,next) => {
        const objectId = grabId(options.id,req.params);
        const data = await Model.findByIdAndDelete(objectId);
        res.status(204).json({
            status: "success",
            message:"با موفقیت حذف شد!"
            
        })
        
    })
