var express = require("express");
var router = express.Router();
var Product = require("../../../models/Product");
const Doctor = require('../../../models/doctors');

router.get("/", async function (req, res, next) {
  console.log("inside");
  setTimeout(async () => {
    let products = await Product.find();

    res.send(products);
  }, 5000);
});

router.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
