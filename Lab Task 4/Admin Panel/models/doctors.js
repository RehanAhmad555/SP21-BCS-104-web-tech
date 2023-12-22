const mongoose = require('mongoose');
const doctorSchema = mongoose.Schema({
  name: String,
  speciality: String,
  hospital: String,
});
const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;