import express from "express";
const router = express.Router();

let reports = [
  {
    id: 1,
    author: "Anonymous Tourist",
    text: "Be careful near old bus stand at night.",
    time: "20 mins ago",
  },
];

// GET all reports
router.get("/", (req, res) => {
  res.json(reports);
});

// POST new report
router.post("/", (req, res) => {
  const newReport = {
    id: Date.now(),
    ...req.body,
  };

  reports.unshift(newReport);
  res.json(newReport);
});

export default router;
