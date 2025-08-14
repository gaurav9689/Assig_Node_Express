
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware: parse JSON bodies
app.use(express.json());

/* ============================
 * Logs method, URL, status code and response time for every request.
 * Uses 'finish' event to ensure statusCode is accurate after response is sent.
 * ============================ */
app.use((req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - started;
    // Example log: GET /users 200 - 3ms
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`);
  });
  next();
});

/* =======================================================
 * In-memory Data Source (array)
 * ======================================================= */
let users = [
  { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" },
  { id: "2", firstName: "John", lastName: "Doe", hobby: "Reading" }
];

/* =======================================================
 * Validation Middleware
 * - For POST /user: requires id, firstName, lastName, hobby
 * - For PUT  /user/:id: requires firstName, lastName, hobby
 * ======================================================= */
function validatePostUser(req, res, next) {
  const { id, firstName, lastName, hobby } = req.body;
  if (!id || !firstName || !lastName || !hobby) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Fields required: id, firstName, lastName, hobby"
    });
  }
  // Ensure unique ID for POST to avoid duplicates
  const exists = users.some(u => u.id === String(id));
  if (exists) {
    return res.status(400).json({
      error: "DuplicateId",
      message: `User with id '${id}' already exists`
    });
  }
  next();
}

function validatePutUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;
  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Fields required for update: firstName, lastName, hobby"
    });
  }
  next();
}



// GET /users – Fetch all users
app.get("/users", (req, res) => {
  return res.status(200).json(users);
});

// GET /users/:id – Fetch user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    // Error handling (10 marks) - not found
    return res.status(404).json({
      error: "NotFound",
      message: `User with id '${req.params.id}' not found`
    });
  }
  return res.status(200).json(user);
});

// POST /user – Add a new user
app.post("/user", validatePostUser, (req, res) => {
  const { id, firstName, lastName, hobby } = req.body;

  const newUser = { id: String(id), firstName, lastName, hobby };
  users.push(newUser);

  // Return 201 Created with the new resource
  return res.status(201).json(newUser);
});

// PUT /user/:id – Update details of an existing user
app.put("/user/:id", validatePutUser, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      error: "NotFound",
      message: `User with id '${req.params.id}' not found`
    });
  }
  const { firstName, lastName, hobby } = req.body;

  // Update full resource (per assignment requirement)
  user.firstName = firstName;
  user.lastName = lastName;
  user.hobby = hobby;

  return res.status(200).json(user);
});

// DELETE /user/:id – Delete a user by ID
app.delete("/user/:id", (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      error: "NotFound",
      message: `User with id '${req.params.id}' not found`
    });
  }
  users.splice(idx, 1);
  // No content on success
  return res.status(204).send();
});

/* ====================================
 * Catches any uncaught errors and returns 500.
 * ==================================== */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  return res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred"
  });
});

/* ============
 * Start server
 * ============ */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
