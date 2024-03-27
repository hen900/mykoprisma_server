const mongoose = require('../common/services/mongoose.service').mongoose;


var imageSchema = new mongoose.Schema({
//    name: String,
  //  desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
 
module.exports = mongoose.model('Photo', imageSchema);


const Photo = mongoose.model('test_data_5', imageSchema);


