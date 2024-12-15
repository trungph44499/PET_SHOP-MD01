const mongoose = require("mongoose");

const petCareSchema = new mongoose.Schema({
  service: String,
  name: String,
  email: String,
  phone: String,
  namePet: String, // tên thú cưngcưng
  message: String,
  status: {
    default: "pendingPet",
    type: String,
  },
  idStaff: String,
  nameStaff: String,
});

const petCareModel = mongoose.model("pet_cares", petCareSchema);
module.exports = petCareModel;
