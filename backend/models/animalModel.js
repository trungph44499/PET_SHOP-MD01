const mongoose = require("mongoose");
const animalSchema = new mongoose.Schema({
  img: String,
  name: String,
  price: String,
  origin: String,
  quantity: Number,
  status: String,
  type: String,
  description: String,
});

const animalModel = mongoose.model("animals", animalSchema);
module.exports = animalModel;
