const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    telephone: Number,
    email: {type: String,
            unique: true 
        },
    password: String
 
});

// userSchema.virtual('productAdded', {
//     ref: 'products', //The Model to use
//     localField: '_id', //Find in Model, where localField 
//     foreignField: 'user', // is equal to foreignField
//  }); 
 
//  // Set Object and Json property to true. Default is set to false
//  userSchema.set('toObject', { virtuals: true });
//  userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', userSchema);