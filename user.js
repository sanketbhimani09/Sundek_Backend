const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    fullName: String,
    mobileNo: String,
    capacity: Number,
    quantity: Number,
    city: String,
    state: String,
    pincode: String,
    orderDate: Date,
    address: String
})
const UserModel = mongoose.model("form_data", UserSchema)
module.exports=UserModel