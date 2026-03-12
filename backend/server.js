import express from "express";
import cors from "cors";
import alertsRoutes from "./alerts.js";
import reportsRoutes from "./reports.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* Existing Routes */
app.use("/api/alerts", alertsRoutes);
app.use("/api/reports", reportsRoutes);

/* ---------------- CONTACTS API ---------------- */

let contacts = [
  { id: 1, name: "Mom", phone: "+91 98765 43210", primary: true },
  { id: 2, name: "Best Friend", phone: "+91 91234 56789", primary: false },
];

// Get all contacts
app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

// Add new contact
app.post("/api/contacts", (req, res) => {
  const newContact = {
    id: Date.now(),
    name: req.body.name,
    phone: req.body.phone,
    primary: false,
  };

  contacts.push(newContact);
  res.json(newContact);
});

/* ---------------- BLOOD EMERGENCY API ---------------- */

let donors = [];
let bloodRequests = [];

// Register Blood Donor
app.post("/api/blood/donor/register", (req, res) => {
  const donor = {
    id: Date.now(),
    name: req.body.name,
    bloodGroup: req.body.bloodGroup,
    city: req.body.city,
    phone: req.body.phone,
  };

  donors.push(donor);

  res.json({
    message: "Donor registered successfully",
    donor,
  });
});

// Request Blood
app.post("/api/blood/request", (req, res) => {
  const request = {
    id: Date.now(),
    name: req.body.name,
    bloodGroup: req.body.bloodGroup,
    location: req.body.location,
    phone: req.body.phone,
  };

  bloodRequests.push(request);

  res.json({
    message: "Blood request submitted",
    request,
  });
});

// Get donors by blood group
app.get("/api/blood/donors/:group", (req, res) => {
  const group = req.params.group;

  const result = donors.filter(
    (donor) => donor.bloodGroup === group
  );

  res.json(result);
});

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("🚀 Tourist Safety Backend is running!");
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});