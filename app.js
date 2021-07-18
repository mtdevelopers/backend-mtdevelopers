const express = require("express");
const errorController = require("./controller/errorController");
const appError = require("./utils/appError");
const cookieParser = require("cookie-parser");
const pug = require("pug");
const path = require("path");
const bodyParser = require("body-parser");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
// importing routes
const realtorProfileRouter = require("./router/apiRouters/realtorProfileRouter");
const userRouter = require('./router/apiRouters/userRouter');
const realtorRouter = require("./router/crmRouters/realtorRouter");
const propertyRouter = require("./router/apiRouters/propertyRouter");
const requestPropertyRouter = require("./router/apiRouters/requestPropertyRouter");
const countryRouter = require("./router/crmRouters/locationRouter/countryRouter");
const stateRouter = require("./router/crmRouters/locationRouter/stateRouter");
const cityRouter =require("./router/crmRouters/locationRouter/cityRouter");
const jobRouter = require("./router/crmRouters/jobRouter");
const areaRouter = require("./router/crmRouters/locationRouter/areaRouter");
const workplaceRouter = require("./router/crmRouters/locationRouter/workplaceRouter");
// const lineRouter = require("./router/crmRouters/locationRouter/lineRouter");
const userCityRouter = require("./router/apiRouters/userCityRouter");
const userStateRouter = require("./router/apiRouters/userStateRouter");
const userCountryRouter = require("./router/apiRouters/userCountryRouter");
const userAreaRouter = require("./router/apiRouters/userAreaRouter");
const crmPropertyRouter = require("./router/crmRouters/crmPropertyRouter");
const crmUserRouter = require("./router/crmRouters/crmUserRouter");
const crmRequestPropertyRouter = require("./router/crmRouters/crmRequestPropertyRouter");
//
const buyStepsRouter = require("./router/crmRouters/buyStepsRouter");
const customerTypeRouter = require("./router/crmRouters/customerTypeRouter");
const roleRouter = require("./router/crmRouters/roleRouter");
const organizationPositionRouter = require("./router/crmRouters/organizationPositionRouter");
const feedbackRouter = require("./router/crmRouters/feedbackRouter");
const auditRouter = require("./router/crmRouters/auditRouter");
const eventRouter = require("./router/crmRouters/eventRouter");
const newsRouter = require("./router/crmRouters/newsRouter");
/////////////////////////////////////////////////////////
const app = express();
app.use(cors());
// view engin
app.set("view engine","pug");
app.set('views',path.join(__dirname,'views'));
//
app.use(express.static(path.join(__dirname, 'public')));
//
// static resources
//
app.use(sanitize());
app.use(xss());


app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());



// user Routes melketabriz.com//////////////////////////////////////
app.use("/api/v1/user", userRouter);
app.use("/api/v1/realtor-profile",realtorProfileRouter);
app.use("/api/v1/property",propertyRouter);
app.use("/api/v1/requestproperty",requestPropertyRouter);
app.use("/api/v1/state",userStateRouter);
app.use("/api/v1/city",userCityRouter);
app.use("/api/v1/area",userAreaRouter);
app.use("/api/v1/country",userCountryRouter);

// crm routes///////////////////////////////////////////
app.use("/crm/v1/user",crmUserRouter);
app.use("/crm/v1/property",crmPropertyRouter);
app.use("/crm/v1/requestproperty",crmRequestPropertyRouter);
app.use("/crm/v1/realtor",realtorRouter);
app.use("/crm/v1/country",countryRouter);
app.use("/crm/v1/state",stateRouter);
app.use("/crm/v1/city",cityRouter);
app.use("/crm/v1/workplace",workplaceRouter);
app.use("/crm/v1/area",areaRouter);
// app.use("/crm/v1/line",lineRouter);

//user relatedRoutes
app.use("/crm/v1/job",jobRouter);
app.use("/crm/v1/customertype",customerTypeRouter);
app.use("/crm/v1/buysteps",buyStepsRouter);
app.use("/crm/v1/feedback",feedbackRouter);
app.use("/crm/v1/event",eventRouter);
//
app.use("/crm/v1/role",roleRouter);
app.use("/crm/v1/organizationposition",organizationPositionRouter);
//
app.use("/crm/v1/audit",auditRouter);
app.use("crm/v1/news",newsRouter);



// if requested api does not match any route 
app.use("*",(req,res,next) => {
    next(new appError(`cant find this route: ${req.originalUrl}`,"404"));
})


// last part of our middleware stack that grabs all the errors
app.use(errorController);

module.exports = app;