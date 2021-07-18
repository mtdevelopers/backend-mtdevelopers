//authorization is based on location and rules that admin defines
const Property = require("../../model/propertyModel/propertyModel");
const User = require("../../model/userRelatedModels/userModel");
const appError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const RequestProperty = require("../../model/propertyModel/requestPropertyModel");
const Realtor = require("../../model/realtorRelatedModel/realtorModel");

//recieves location array and returns array of string of location id 
const locationArrCreator = (arr) => {
    let locationArr = [];
    for (let index = 0; index < arr.length; index++) {
        const locationStr = String(arr[index]);
        locationArr.push(locationStr);
    }
    return locationArr;
}

//this function will create a query and send in to find all function
const queryCreatorForProp = (organizationPosition) => {
    let queryStr = {
        status_property:{$in:organizationPosition.status_property},
        status_sell:{$in:organizationPosition.status_sell},
        category_property:{$in:organizationPosition.category_property},
        
    };
    return queryStr;
        
}


const queryCreatorForReq = (organizationPosition) => {
    let queryStr = {
        status_property:{$in:organizationPosition.status_property},
        status_sell:{$in:organizationPosition.status_sell},
        category_requestProperty:{$in:organizationPosition.category_property},
        
    };
    return queryStr;
        
}


///////////////////////

/////////////////////////////


//function to detect permisions //////
//document can be Property ,realtor ,request ,property ....
// action can be read ,write ,update ,delete
////// will return ex: read-property-city///////////////////
exports.detectPermissions =(document,action) => {
    return(req,res,next) => {
        if(!req.realtor.role){
            return next(new appError(401,"دارای سمت  نمی باشید!"))
        }
        if(document === "property"){
            if(req.realtor.role.accessOwnProperty){
                return next();
            }
        }
        if(document === "requestProperty"){
            if(req.realtor.role.accessOwnRequestProperty){
                return next();
            }
        }
        const permissions = req.realtor.role.permissions;
        const selectedPermission = permissions.filter(permission => {
            return permission.split("-")[1] === document;
        });
        if(selectedPermission.length === 0){
            return next(new appError(401,"دسترسی این عملیات برای شما وجود ندارد!"))
        }
        const permission = selectedPermission.filter(permission => {
            return permission.split("-")[0] === action;
        });
        if(permission.length === 0){
            return next(new appError(401," دسترسی این عملیات برای شما وجود ندارد!"))
        }
        req.permission = permission;
        return next();
    }
} 
// this function will response with error or grant access 
exports.authorize = (document,action)=>{
    return catchAsync(async(req,res,next) => {
        // if access own is true
        // just access his property
        if(req.realtor.role.accessOwnProperty){
            if(document === "property"){
                switch (action) {
                    case "read":
                        req.query.createdByRealtor = req.realtor._id;
                        return next();
                    case "write":
                        return next();
                    case "update":
                        const updatedDocument = await Property.findById(req.params.propertyId);
                        if(!updatedDocument){
                            return next(new appError(404,"اطلاعات یافت نشد"))
                        }
                        if(updatedDocument.createdByRealtor !== req.realtor._id){
                            return next(new appError(401,"تنها قادر به به روزرسانی آگهی های خود هستید!"))
                        }
                        req.updatedDocument = updatedDocument;
                        return next();
                    case "delete":
                        const deletedDocument = await Property.findById(req.params.propertyId);
                        if(!deletedDocument){
                            return next(new appError(404,"اطلاعات یافت نشد"))
                        }
                        if(String(deletedDocument.createdByRealtor) !== String(req.realtor._id)){
                            return next(new appError(401,"تنها قادر به حذف آگهی های خود هستید!"));
                        }
                        return next();
                
                }
            }
        }
        if(req.realtor.role.accessOwnRequestProperty){
            if(document === "requestProperty"){
                switch (action) {
                    case "read":
                        req.query.createdByRealtor = req.realtor._id;
                        return next();
                    case "write":
                        
                        return next();
                    case "update":
                        const updatedDocument = await RequestProperty.findById(req.params.propertyId);
                        if(!updatedDocument){
                            return next(new appError(404,"اطلاعات یافت نشد"))
                        }
                        if(updatedDocument.status === "addedByCustomer"){
                            req.updatedDocument = updatedDocument;
                            return next();
                        }
                        if(updatedDocument.createdByRealtor !== req.realtor._id){
                            return next(new appError(401,"تنها قادر به به روزرسانی آگهی های خود هستید!"))
                        }
                        req.updatedDocument = updatedDocument;
                        return next();
                    case "delete":
                        const deletedDocument = await RequestProperty.findById(req.params.propertyId);
                        if(!deletedDocument){
                            return next(new appError(404,"اطلاعات یافت نشد"))
                        }
                        if(String(deletedDocument.createdByRealtor) !== String(req.realtor._id)){
                            return next(new appError(401,"تنها قادر به حذف آگهی های خود هستید!"));
                        }
                        return next();
                
                }
            }
        }
// if access own is false
////////////////////////////////////////////////////////////////////////////////////////////
        // grab organization position of the realtor that wants to access
        const organizationPosition = req.realtor.organizationPosition;

        // check for role permissions by documentType and action
        //comming form previous middleware eg. read-property-city
        const filteredPermissionByActionAndDocument = req.permission;
        
        //grab scope of location eg. city
        const allowedLocation = filteredPermissionByActionAndDocument[0].split("-")[2];

        
/////////////////////////////////////property actions authorization////////////////////////
        if(document === "property"){
            if(action === "read"){
                let queryString = queryCreatorForProp(organizationPosition);
                if(req.realtor.state.length !== 0){
                    queryString = { ...queryString,
                        state : {$in: locationArrCreator(req.realtor.state)}
                    }
                }
                if(req.realtor.city.length !==0 ){
                    queryString = { ...queryString,
                        city : {$in: locationArrCreator(req.realtor.city)}
                    }
                }
                if(req.realtor.area.length !== 0 ){
                    queryString = { ...queryString,
                        area : {$in: locationArrCreator(req.realtor.area)}
                    }
                }
                // if want to search in floors
                // pass a floor=1&floor=2&floor=3 
                if(req.query.floor){
                    queryString = {...queryString,floor:{$in:req.query.floor}}
                }
                req.query = {...req.query,...queryString};
                return next();
            }else if(action === "write"){
                // realtors property
                if(organizationPosition.status_property.indexOf(req.body.status_property) === -1 ){
                    return next(new appError(401,"امکان ایجاد در این نوع آگهی(مسکونی یا تجاری) برای شما وجود ندارد"))
                } 
                if(organizationPosition.status_sell.indexOf(req.body.status_sell) === -1){
                    return next(new appError(401,"امکان ایجاد یا به روز رسانی در این نوع آگهی(فروش یا اجاره یا مشارکت) برای شما وجود ندارد"))
                } 
                if(organizationPosition.category_property.indexOf(req.body.category_property) === -1){
                    return next(new appError(401,"قادر به ایجاد آگهی در این دسته بندی نیستید"))
                }
           
                return next();
            }else if(action=== "update"){
                // find the document that user wants to update
                const updatedDocument = await Property.findById(req.params.propertyId);
                if(!updatedDocument){
                    return next(new appError(404,"آگهی یافت نشد!"))
                }
                //check for the document that wants to update
                // location check
                if(req.realtor.country > 0){
                    if(String(req.realtor.country).indexOf(String(updatedDocument.country._id)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در کشور تعیین شده برای شما وجود دارد!"))
                    }
                }
                
                if(req.realtor.state > 0){
                    if(String(req.realtor.state).indexOf(String(updatedDocument.state._id)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در استان تعیین شده برای شما وجود دارد!"))
                    }
                }
                if(req.realtor.city > 0){
                    if(String(req.realtor.city).indexOf(String(updatedDocument.city._id)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در شهر تعیین شده برای شما وجود دارد!"))
                    }
                }
                if(req.realtor.area.length > 0){
                    if(String(req.realtor.area).indexOf(String(updatedDocument.area._id)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در منطقه تعیین شده برای شما وجود دارد!"))
                    }
                }
                // organization position check
                if(organizationPosition.status_property.indexOf(updatedDocument.status_property) === -1 ){
                    return next(new appError(401,"امکان  به روز رسانی در این نوع آگهی(مسکونی یا تجاری) برای شما وجود ندارد"))
                } 
                if(organizationPosition.status_sell.indexOf(updatedDocument.status_sell) === -1){
                    return next(new appError(401,"امکان به روز رسانی در این نوع آگهی(فروش یا اجاره یا مشارکت) برای شما وجود ندارد"))
                } 
                if(organizationPosition.category_property.indexOf(updatedDocument.category_property) === -1){
                    return next(new appError(401,"امکان به روز رسانی این نوع آگهی برای شما فراهم نمی باشد."))
                }
                //check for the info that user wants to update the document to another document
                // location check
                if(req.realtor.country.length > 0){
                    if(String(req.realtor.country).indexOf(String(req.body.country)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در کشور تعیین شده برای شما وجود دارد!"))
                    }
                }
                if(req.realtor.state.length> 0){
                    if(String(req.realtor.state).indexOf(String(req.body.state)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در استان تعیین شده برای شما وجود دارد!"))
                    }
                }
                
                if(req.realtor.city.length > 0){
                    if(String(req.realtor.city).indexOf(String(req.body.city)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در شهر تعیین شده برای شما وجود دارد!"))
                    }
                }
                
                if(req.realtor.area.length > 0){
                    if(String(req.realtor.area).indexOf(String(req.body.area)) === -1){
                        return next(new appError(401,"امکان به روز رسانی آگهی در منطقه تعیین شده برای شما وجود دارد!"))
                    }
                }
                
                // check for the organization position
                if(organizationPosition.status_property.indexOf(req.body.status_property) === -1){
                    return next(new appError(401,"امکان  به روز رسانی در پست سازمانی خود(مسکونی یا تجاری) را دارید!"))
                }
                if(organizationPosition.status_sell.indexOf(req.body.status_sell) === -1){
                    return next(new appError(401,"امکان به روز رسانی در پست سازمانی خود(فروش یا اجاره یا مشارکت) برای شما وجود دارد"))
                }
                if(organizationPosition.category_property.indexOf(req.body.category_property) === -1){
                    return next(new appError(401,"امکان ایجاد آگهی در این موقعیت مکانی برای شما فراهم نیست!"))
                }
                ////////////////////////////////////////////////////////
                ///////////////   
                
                req.updatedDocument = updatedDocument;
                return next();
            }else if(action === "delete"){
                //document id and realtor
                const documentToDelete = await Property.findById(req.params.propertyId);
                if(!documentToDelete){
                    return next(new appError(404,"چنین آگهی یافت نشد!"))
                }
                
                //check for the location 
                if(req.realtor.country.length > 0 && String(req.realtor.country).indexOf(String(documentToDelete.country._id)) === -1){
                    return next(new appError(401,"امکان حذف آگهی در کشور تعیین شده برای شما وجود دارد!"))
                }
                if(req.realtor.state.length > 0 && String(req.realtor.state).indexOf(String(documentToDelete.state._id)) === -1){
                    return next(new appError(401,"امکان حذف آگهی در استان تعیین شده برای شما وجود دارد!"))
                }
                if(req.realtor.city.length > 0 && String(req.realtor.city).indexOf(String(documentToDelete.city._id)) === -1){
                    return next(new appError(401,"امکان حذف آگهی در شهر تعیین شده برای شما وجود دارد!"))
                }
                if(req.realtor.area.length > 0 && String(req.realtor.area).indexOf(String(documentToDelete.area._id)) === -1){
                    return next(new appError(401,"امکان حذف آگهی در منطقه تعیین شده برای شما وجود دارد!"))
                }

                //check for the organization position
                if(organizationPosition.status_property.indexOf(documentToDelete.status_property) === -1){
                    return next(new appError(401,"امکان ایجاد یا به روز رسانی در این نوع آگهی(مسکونی یا تجاری) برای شما وجود ندارد"))
                } 
                if(organizationPosition.status_sell.indexOf(documentToDelete.status_sell) === -1){
                    return next(new appError(401,"امکان ایجاد یا به روز رسانی در این نوع آگهی(فروش یا اجاره یا مشارکت) برای شما وجود ندارد"))
                } 
                if(organizationPosition.category_property.indexOf(documentToDelete) === -1){
                    return next(new appError(401,"نمی توانید آگهی را حذف کنید!"))
                }
                return next();
            
            }
////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
        }else if(document === "requestProperty"){
                if(action === "read"){
                    //list requests that are in my role and organization position
                    // and status is confirmedByRealtor
                    let queryString = queryCreatorForReq(organizationPosition);
                    //query for requests that are refrenced to me
                    queryString = {...req.query,...queryString};
                    const queryForRefrencedToMe = { refrenceToRealtor:{$in:[req.realtor._id]}};
                    
                    req.query = {$or:[queryString,queryForRefrencedToMe]};
                    
                    
                    return next();
                }else if(action === "write"){
                    // 
                    return next();
                }else if(action=== "update"){
                    // find the document that user wants to update
                    const updatedDocument = await RequestProperty.findById(req.params.requestpropertyId);
                    if(!updatedDocument){
                        return next(new appError(404,"آگهی یافت نشد!"))
                    }
                    //check for the document that wants to update
                    if(updatedDocument.status !== "addedByCustomer"){
                        if(String(updatedDocument.createdByRealtor) !== String(req.realtor._id || String(updatedDocument.refrenceToRealtor) !== req.realtor._id)){
                            return next(new appError(401,"شما می توانید درخواست های خود یا درخواستهایی که به شما ارجاع داده شده اند را به روز رسانی کنید!"))
                        }
                    }
                    req.updatedDocument = updatedDocument;
                    return next();
                }else if(action === "delete"){
                    //document id and realtor
                    const documentToDelete = await RequestProperty.findById(req.params.requestpropertyId);
                    if(!documentToDelete){
                        return next(new appError(404,"چنین آگهی یافت نشد!"))
                    }
                    if(String(documentToDelete.createdByRealtor) !== String(req.realtor._id)){
                        return next(new appError(401,"فقط می توانید درخواست هایی که خودتان ثبت کردید را حذف نمایید"))
                    }
                    return next();
                }
        
///////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////user actions authorization////////////////////////
// read-user
/////////////////////////////////////user actions authorization////////////////////////
        }else if(document === "user"){
            if(action === "read"){
                // if has a permission can read all the users in allowed location
                req.query[allowedLocation] = { $in : req.realtor[allowedLocation] }
                return next();
            }
            if(action === "write"){
                return next();
            }
            if(action === "update"){
                return next();
            }
            if(action === "delete"){
                return next();
            }
/////////////////////////////////////realtor actions authorization////////////////////////


/////////////////////////////////////realtor actions authorization////////////////////////            
        }else if(document === "realtor"){
            switch (action) {
                case "read":
                    req.query[allowedLocation] = {$in : req.realtor[allowedLocation]};
                    return next();
                case "write":
                    req.body[allowedLocation].forEach(location => {

                        if(req.realtor[allowedLocation].indexOf(location) === -1){
                            return next(new appError(401,"امکان ایجاد مشاور در این موقیعت را ندارید."))
                        }
                    });
                    return next();
                case "delete":
                    const documentToDelete = await Realtor.findById(req.params.realtorId);
                    if(!documentToDelete){
                        return next(new appError(404,"یافت نشد"))
                    }
                    
                    documentToDelete[allowedLocation].forEach(location => {
                        if(req.realtor[allowedLocation].indexOf(location) === -1){
                            return next(new appError(401,"امکان حذف مشاور در این موقیعت را ندارید."))
                        }
                    });
                    return next();
                }
        }else if(document === "stats"){
            const permission = req.permission;
            const allowedStats = permission[0].split("-")[2];

            switch (allowedStats) {
                case "own":
                    // get statistices of the properties that createdByRealtor = realtor Id
                    req.query.ownRealtor = req.realtor._id;
                    req.check = true;
                    return next();
                case "myrealtors":
                    // get statistices of the properties that createdByRealtor = {$in:[realtor1,realtor2,realtor3]}
                    req.query.realtorArr = req.realtor.realtorsList;
                    req.check = true;
                    return next();
                case "all":
                    // dont match the createdByRealtor field
                    req.check = false;
                    return next();
                }
        }
        
    })
}



