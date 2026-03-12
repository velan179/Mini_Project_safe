const express = require("express");
const router = express.Router();

const { donors, bloodRequests } = require("../data/bloodData");


// Register Donor
router.post("/donor/register", (req, res) => {

  const donor = {
    name: req.body.name,
    bloodGroup: req.body.bloodGroup,
    city: req.body.city,
    phone: req.body.phone
  };

  donors.push(donor);

  res.json({
    message: "Donor registered successfully",
    donor
  });

});


// Request Blood
router.post("/request", (req, res) => {

  const request = {
    name: req.body.name,
    bloodGroup: req.body.bloodGroup,
    location: req.body.location,
    phone: req.body.phone
  };

  bloodRequests.push(request);

  res.json({
    message: "Blood request sent successfully",
    request
  });

});


// Get donors by blood group
router.get("/donors/:group", (req, res) => {

  const group = req.params.group;

  const result = donors.filter(
    donor => donor.bloodGroup === group
  );

  res.json(result);

});

module.exports = router;