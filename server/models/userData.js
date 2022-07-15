const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserData = new Schema({
 username: {
  type: String,
  required: true,
  trim: true
 }
});
 
const Data = mongoose.model('userData', UserData);
 
module.exports = Data;
