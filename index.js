const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Job = require("./models/Job");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jobboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get("/api/jobs", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send("Job not found");
    res.json(job);
  } catch (err) {
    res.status(500).send("Invalid ID format");
  }
});

app.post("/api/jobs", async (req, res) => {
  const { title, company, type, location, description } = req.body;
  if (!title || !company || !type || !location || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const job = new Job({ title, company, type, location, description });
  await job.save();
  res.status(201).json(job);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));