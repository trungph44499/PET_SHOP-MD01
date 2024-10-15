const express = require("express");
const router = express.Router();
const animalModel = require("../models/animalModel");

router.get("/", async (req, res) => {
  try {
    const getAnimals = await animalModel.find({});
    res.status(200).send({ response: getAnimals });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
