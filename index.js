const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

/* ---------------------------
   Helper Functions
----------------------------*/

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ---------------------------
   Routes
----------------------------*/

// Health check
app.get("/api/reviews", (req, res) => {
  res.send("Andromedia Backend Running 🚀");
});

// Get all reviews
app.get("/api/reviews", (req, res) => {
  const reviews = readData();
  res.json(reviews.reverse());
});

// Add new review
app.post("/api/reviews", (req, res) => {
  const reviews = readData();

  const newReview = {
    id: Date.now(),
    publisher: req.body.publisher,
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date()
  };

  reviews.push(newReview);
  writeData(reviews);

  res.json({ success: true, review: newReview });
});

// Delete review (optional)
app.delete("/api/reviews/:id", (req, res) => {
  let reviews = readData();
  reviews = reviews.filter(r => r.id != req.params.id);

  writeData(reviews);
  res.json({ success: true });
});

/* ---------------------------*/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
