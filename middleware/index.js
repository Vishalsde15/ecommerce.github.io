const prodctModel = require("./model/products");
const categoryModel = require("./model/category");
const userModel = require("./model/user")

module.exports = {
    isAuth(req, res, next) {
        const Users = await userModel.findOne(req.params.email) 
    }
}