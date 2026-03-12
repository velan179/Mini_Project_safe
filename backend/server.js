import express from "express";
import cors from "cors";
import alertsRoutes from "./alerts.js";
import reportsRoutes from "./reports.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/alerts", alertsRoutes);
app.use("/api/reports", reportsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Tourist Safety Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
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
