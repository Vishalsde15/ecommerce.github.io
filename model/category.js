const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema ({
    categoryName: String,
    img_url: String, 
    noOfProducts: Number
});

module.exports = mongoose.model('category1', categorySchema);

