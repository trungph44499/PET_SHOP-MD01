const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const City = mongoose.model('citys', citySchema);

module.exports = City;