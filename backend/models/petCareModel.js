const mongoose = require("mongoose");

const petCareSchema = new mongoose.Schema({
  service: String,
  name: String,
  email: String,
  phone: String,
  message: String,
  status: {
    default: "pending",
    type: String,
  },
});

const petCareModel = mongoose.model("pet_cares", petCareSchema);
module.exports = petCareModel;
