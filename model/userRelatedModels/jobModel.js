const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"عنوان شغل مورد نظر را وارد کنید!"],
        unique:true
    }
})




const Job = mongoose.model('Job',jobSchema);

module.exports = Job;