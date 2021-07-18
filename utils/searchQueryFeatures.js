// can read about this module in  https://virgool.io/@m_72351797

class searchQueryFeatures {
    //query refers to resource that we want to pass in the calss eg. House or user or realtor
    //queryString refers to the query object of url eg. api/v1/houses?price=500
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    // 
    filter(){
      
        const queryObj = { ...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        //add $ to query object
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
          /\b(gte|gt|lte|lt)\b/g,
          (match) => `$${match}`
        );
        console.log(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));
        return this;


    }
    // 
    sort(){
        if (this.queryString.sort) {
          const sortBy = this.queryString.sort.toString().split(',').join(' ');
          this.query = this.query.sort(sortBy);
        } else {
          this.query = this.query.sort('-updatedAt');
        } 
        return this;
    }
    // 
    limitFields(){
        if (this.queryString.fields) {
          const fields = this.queryString.fields.toString().split(',').join(' ');
          this.query = this.query.select(fields);
        }
        return this;

    }
    // 
    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 16;

        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
      return this;
    }
    

}


module.exports = searchQueryFeatures;