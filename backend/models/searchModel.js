// models/searchModel.js
const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  emailUser: String,
  txt: String,
});

const searchModel = mongoose.model("searchs", searchSchema);
module.exports = searchModel;
