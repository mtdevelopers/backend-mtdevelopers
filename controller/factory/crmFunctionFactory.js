const appError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const SearchQueryFeatures = require("../../utils/searchQueryFeatures");
const Audit = require("../../model/auditModel");


// create audit log form audit schema
const auditCreator = async(actionType,documentIdentifier,creator,data,diff) => {
    switch (documentIdentifier) {
        case "property":
            await Audit.create({
                action:`${actionType} ${documentIdentifier}`,
                createdBy:{
                    firstName:creator.firstName,
                    lastName:creator.lastName
                },
                differents:diff,
                property:data,
            });
            break;
        case "requestedProperty":
            await Audit.create({
                action:`${actionType} ${documentIdentifier}`,
                createdBy:{
                    firstName:creator.firstName,
                    lastName:creator.lastName
                },
                differents:diff,
                requestProperty:data,
            });
            break;
        case "realtor":
            await Audit.create({
                action:`${actionType} ${documentIdentifier}`,
                createdBy:{
                    firstName:creator.firstName,
                    lastName:creator.lastName
                },
                differents:diff,
                realtor:data,
            });
            break;
        case "event":
            await Audit.create({
                action:`${actionType} ${documentIdentifier}`,
                createdBy:{
                    firstName:creator.firstName,
                    lastName:creator.lastName,
                    code:creator.code
                },
                differents:diff,
                event:data,
            });
            break;
    
        default:
            break;
    }


    
}

const bannedAction = (realtor,body) => {
    if(realtor.role.roleType === "realtor" && body.status === "confirmedByManager"){
        return true;
    }
    

}


// creating a filter object to pass in to the query
const filterCreator = (params) => {
    let filter = {};
    //params is an object 
    //{
    //     cityId: '123456',
    //     areaId: '123456',
    //     workplaceId: '12345',
    //     lineId: '12345'
    // }
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


exports.getAll = (Model,options,popOptions) => 
    catchAsync(async(req,res,next) => {
        // check req. params to filter by params
        const filter = filterCreator(req.params);
        // const features = new SearchQueryFeatures(Model.find(filter),req.query)
        const queryStr = { $and:[req.query,filter]};
        // const queryStr = req.query;
        const features = new SearchQueryFeatures(Model.find(),queryStr)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // execute query
        let query = features.query;
        if(popOptions) query.populate(popOptions);
        const data = await query;

        if(options &&
            options.identifier === "property" ||
            options.identifier === "requestedProperty" ||
            options.identifier === "realtor" || 
            options.identifier === "event"){
                await auditCreator("search",options.identifier,req.realtor,data._id,"");
            }
        const count = data.length;
            res.status(200).json({
            status: "success",
            count,
            data
        })
    });


exports.createOne = (Model,options) => 
    catchAsync(async(req,res,next) => {
        if(options && (options.identifier === "property" || "requestedProperty")){
            if(req.realtor){
                req.body.createdByRealtor = req.realtor._id;
                req.body.status = "confirmedByRealtor";
                req.body.creator = "realtor"
            }else if(req.user){
                req.body.createdByCustomer = req.user._id;
                req.body.status = "addedByCustomer";
                req.body.creator = "customer"
            }
        }
        if(options.identifier === "event"){
            req.body.createdBy = req.realtor._id
        }
        const data = await Model.create(req.body);
        if(options.identifier === "property" ||
            options.identifier === "requestedProperty" ||
            options.identifier === "realtor" ||
            options.identifier === "event"){
            await auditCreator("create",options.identifier,req.realtor,data._id,"");
            }
        
        
        res.status(200).json({
            status: "success",
            data
        })
    });

exports.updateOne = (Model,options) =>
    catchAsync(async(req,res,next) => {
        // country/:counryId //his function created for nested Routes
        const objectId = grabId(options.id,req.params);
        // check if the property belongs to the user
        
        // const data = await Model.findByIdAndUpdate(objectId,req.body,{
        //     runValidators:true,
        //     new:true
        // });
        const data = await Model.findById(objectId); 
        if(!data){
            return next(new appError(404,"یافت نشد!"))
        }
        if(bannedAction(req.realtor,req.body)){
            return next(new appError(405,"نمی توانید این فیلد را تغییر دهید!"))
        }
        Object.assign(data,req.body);
        await data.save();

        
        if(options.identifier === "property" ||
            options.identifier === "requestedProperty" ||
            options.identifier === "realtor" || 
            options.identifier === "event"){
            await auditCreator("update",options.identifier,req.realtor,data._id,data.log());
            }
        res.status(200).json({
            status: "success",
            data
        })
    })

exports.deleteOne = (Model,options) => 
    catchAsync(async(req,res,next) => {
        const objectId = grabId(options.id,req.params);
        const data = await Model.findByIdAndDelete(objectId);
        if(options.identifier === "property" ||
            options.identifier === "requestedProperty" ||
            options.identifier === "realtor" || 
            options.identifier === "event"){
            await auditCreator("delete",options.identifier,req.realtor,data._id,"");
            }
        res.status(204).json({
            status: "success",
            message:"با موفقیت حذف شد!"
            
        })
        
    })
exports.updateAndSave = (Model,options) => 
    catchAsync(async(req,res,next) => {
        // const objectId = grabId(options.id,req.params);
        // let updatedDocument = await Model.findOne({_id:objectId});
        let updatedDocument = req.updatedDocument;
        if(!updatedDocument){
            return next(new appError(404,"یافت نشد!"))
        }
        if(bannedAction(req.realtor,req.body)){
            return next(new appError(405,"نمی توانید این فیلد را تغییر دهید!"))
        }
        // if totalPrice change
        const oldUpdateLog = updatedDocument.updateLog;
        if(req.body.totalPrice !== updatedDocument.totalPrice){
            const newupdateLog = {
                realtor : req.realtor._id,
                priceFrom : updatedDocument.totalPrice,
                priceTo : req.body.totalPrice,
                Date:Date.now()
            };
            const updateLog = [...oldUpdateLog,newupdateLog];
            req.body.updateLog = updateLog;
            
        }
        // if deposite_price change
        if(req.body.deposite_price !== updatedDocument.deposite_price || 
            req.body.rent_price !== updatedDocument.rent_price){
            const newupdateLog = {
                realtor : req.realtor._id,
                depositeFrom : updatedDocument.deposite_price,
                depositeTo : req.body.deposite_price,
                rentFrom: updatedDocument.rent_price,
                rentTo:req.body.rent_price,
                Date:Date.now()
            };   
            const updateLog = [...oldUpdateLog,newupdateLog];  
            req.body.updateLog = updateLog;
        }
        Object.assign(updatedDocument,req.body);
        await updatedDocument.save();

        // log the delete 
        if(options.identifier === "property" ||
            options.identifier === "requestedProperty" ||
            options.identifier === "realtor"){
            await auditCreator("update",options.identifier,req.realtor,updatedDocument._id,updatedDocument.log());
            }


        res.status(200).json({
            message:"success",
            updatedDocument
        })
    })


// conditional populate for requested properties

exports.getAllWithPopulate = (Model,popOptions) => 
    catchAsync(async(req,res,next) => {
        const features = new SearchQueryFeatures(Model.find(),req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // execute query
        const data = await features.query.populate(popOptions);

        await auditCreator("search","requestedProperty",req.realtor,data._id,"");

        
        const count = data.length;
            res.status(200).json({
            status: "success",
            count,
            data
        })
    });

