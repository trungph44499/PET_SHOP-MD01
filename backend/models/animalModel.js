const mongoose = require("mongoose");
const animalSchema = new mongoose.Schema({
  img: String,
  name: String,
  type: String,
  price: Number,
  origin: String,
  size: String,
  quantity: Number,
  description: String,
});

const animalModel = mongoose.model("animals", animalSchema);
module.exports = animalModel;
