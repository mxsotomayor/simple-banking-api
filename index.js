const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 9001;

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// === Read data from db.json on server startup === //

// === Helper function to save data back to db.json === //
function saveData() {
  const jsonData = JSON.stringify({ users }, null, 2); // Pretty-print with 2 spaces
  fs.writeFileSync(path.join(__dirname, "db.json"), jsonData, "utf8");
}

function loadData(key) {
  let rawData = fs.readFileSync(path.join(__dirname, "db.json"), "utf8");
  let data = JSON.parse(rawData);
  return data[key];
}

// === Endpoints === //

// 1) Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my simple Express API with a JSON file DB!",
  });
});

// 2) Get all users
app.get("/users", (req, res) => {
  res.json(loadData("users"));
});

app.get("/auth", (req, res) => {
  const { username, password } = req.body;

  res.status(401);
});

// 3) Get a single user by ID (including credit cards, balance, and transactions)
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = loadData("users").find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// 4) Create (POST) a new user
app.post("/users", (req, res) => {
  // In a real app, validations and error handling would be more robust.
  const newUser = {
    ...req.body,
    id: loadData("users").length ? users[users.length - 1].id + 1 : 1, // Basic auto-increment
  };

  users.push(newUser);

  // Save the updated users array to db.json
  saveData();

  res.json({
    message: "User created successfully!",
    user: newUser,
  });
});

// 5) (Optional) Update a user’s balance, transactions, etc.
//    e.g. to add a transaction or modify balance for an existing user
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = loadData("users").findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update user with new info from the request body
  // (assuming user passes a complete or partial user object)
  const updatedUser = {
    ...users[userIndex],
    ...req.body,
    id: userId, // ensure the ID stays the same
  };

  users[userIndex] = updatedUser;

  // Save updates to db.json
  saveData();

  res.json({
    message: "User updated successfully!",
    user: updatedUser,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
