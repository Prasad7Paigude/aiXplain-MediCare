const mongoose = require('mongoose');

const hospitalBedSchema = new mongoose.Schema({
  location: { type: String, required: true },
  bedType: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const HospitalBed = mongoose.model('HospitalBed', hospitalBedSchema);

module.exports = HospitalBed;
