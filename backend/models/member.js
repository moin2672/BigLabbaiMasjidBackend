const mongoose = require('mongoose');

const memberSchema =  mongoose.Schema({
    mID:{type:String, required: true},
    initials: {type:String},
    name: {type:String, required: true},
    fathersName: {type:String, required: true},
    age: {type:String, required: true},
    doorNo: {type:String, required: true},
    streetName: {type:String, required: true},
    lastUpdatedDate: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Member', memberSchema);