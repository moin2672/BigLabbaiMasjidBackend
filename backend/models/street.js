const mongoose = require('mongoose');

const streetSchema =  mongoose.Schema({
    streetName: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Street', streetSchema);