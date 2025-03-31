const express = require("express");
const path = require("path");
const DBProvider = require("./db.provider");
const app = express();
const port = 9001;

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🚀 === Endpoints === //

// 😉 forcing content for svg files
app.get("/cardIssuers/:name", (req, res) => {
  const filepath = path.join(__dirname, "public", "cards", req.params.name + ".svg");
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(filepath);
});

app.get("/users", (req, res) => {
  res.json(DBProvider.pullData("users"));
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  res.status(401);
});

// 3) Get a single user by ID (including credit cards, balance, and transactions)
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = DBProvider.pullData("users").find((u) => u.id === userId);

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
    id: DBProvider.pullData("users").length
      ? users[users.length - 1].id + 1
      : 1, // Basic auto-increment
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
  const userIndex = DBProvider.pullData("users").findIndex(
    (u) => u.id === userId
  );

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
  DBProvider.flushData();

  res.json({
    message: "User updated successfully!",
    user: updatedUser,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
