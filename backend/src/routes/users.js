const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const {
  listUsers,
  getUserById,
  getUserRawByEmail,
  createUser,
  updateUser,
  updateUserStatus
} = require("../data/store");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/**
 * AUTH (Generic) - Login
 * POST /auth/login
 * body: { email, password }
 */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  try {
    const user = await getUserRawByEmail(String(email));
    if (!user || user.password !== String(password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.status !== "active") {
      return res.status(403).json({ message: "User is not active" });
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role, status: user.status }
    });
  } catch (e) {
    return res.status(500).json({ message: "Database error", error: e.message });
  }
});

/**
 * USER IDENTITY (Core)
 * Subdomain: Registration
 * POST /users  (admin only)
 * body: { id, name, email, role, status, password }
 */
router.post("/users", auth, requireRole(["admin"]), async (req, res) => {
  const { id, name, email, role, status, password } = req.body || {};
  if (!id || !name || !email) {
    return res.status(400).json({ message: "id, name, email are required" });
  }

  try {
    const created = await createUser({
      id: String(id),
      name: String(name),
      email: String(email),
      role: role ? String(role) : "employee",
      status: status ? String(status) : "active",
      password: password ? String(password) : "user123"
    });
    return res.status(201).json(created);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

/**
 * USER IDENTITY (Core)
 * List users (admin only)
 * GET /users
 */
router.get("/users", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const users = await listUsers();
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ message: "Database error", error: e.message });
  }
});

/**
 * USER IDENTITY (Core)
 * Get own profile
 * GET /users/me
 */
router.get("/users/me", auth, async (req, res) => {
  try {
    const user = await getUserById(req.user.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ message: "Database error", error: e.message });
  }
});

/**
 * USER IDENTITY (Core)
 * Get profile
 * GET /users/:id
 * admin can access anyone
 * employee can access self only
 */
router.get("/users/:id", auth, async (req, res) => {
  const targetId = String(req.params.id);

  if (req.user.role !== "admin" && req.user.user_id !== targetId) {
    return res.status(403).json({ message: "Employees can only access their own profile" });
  }

  try {
    const user = await getUserById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ message: "Database error", error: e.message });
  }
});

/**
 * USER IDENTITY (Core)
 * Subdomain: Update Profile
 * PATCH /users/:id  (admin or self)
 * body: { name?, email? }
 */
router.patch("/users/:id", auth, async (req, res) => {
  const targetId = String(req.params.id);

  const isAdmin = req.user.role === "admin";
  const isSelf = req.user.user_id === targetId;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    console.log('UPDATE Request:', {
      targetId,
      body: req.body,
      isAdmin,
      isSelf
    });
    
    const updated = await updateUser(targetId, req.body || {});
    console.log('UPDATE Result:', updated);
    
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.json(updated);
  } catch (e) {
    console.error('UPDATE Error:', e);
    return res.status(500).json({ message: "Database error", error: e.message });
  }
});

/**
 * USER IDENTITY (Core)
 * Subdomain: Employee Status
 * PATCH /users/:id/status (admin only)
 * body: { status: "active" | "inactive" | "resigned" }
 */
router.patch("/users/:id/status", auth, requireRole(["admin"]), async (req, res) => {
  const targetId = String(req.params.id);
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ message: "status required" });

  const allowed = ["active", "inactive", "resigned"];
  if (!allowed.includes(String(status))) {
    return res.status(400).json({ message: `status must be one of: ${allowed.join(", ")}` });
  }

  try {
    const updated = await updateUserStatus(targetId, String(status));
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ message: "Database error", error: e.message });
  }
});

/**
 * DEBUG - Get user with raw password (REMOVE IN PRODUCTION!)
 * GET /debug/users/:id
 */
router.get("/debug/users/:id", auth, async (req, res) => {
  try {
    const user = await getUserRawByEmail((await getUserById(req.params.id))?.email);
    return res.json(user || { message: "User not found" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
