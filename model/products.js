const mongoose = require("mongoose");
const { Schema } = mongoose;


const productsSchema = new Schema ({
    userId: String,
    category: Number,
    name: String,
    img_url: String,
    mrp: Number, 
    price: Number,
    reviewstar: Number,
    noOfReviews: Number,
    
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true
    //  }
});
module.exports = mongoose.model('products', productsSchema);



