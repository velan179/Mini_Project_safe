import express from "express";
const router = express.Router();

let alerts = [
  {
    id: 1,
    title: "Pickpocketing reported",
    location: "City Market",
    severity: "high",
    time: "5 mins ago",
  },
];

// GET all alerts
router.get("/", (req, res) => {
  res.json(alerts);
});

// POST new alert
router.post("/", (req, res) => {
  const newAlert = {
    id: Date.now(),
    ...req.body,
  };

  alerts.push(newAlert);
  res.json(newAlert);
});

export default router;
