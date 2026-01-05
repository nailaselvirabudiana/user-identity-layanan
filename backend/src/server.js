const express = require("express");
const cors = require("cors");
const routes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3040;

app.use(cors({
    origin: ['https://app.queenifyofficial.site']
}));
app.use(express.json());

// info (root)
app.get("/", (req, res) => {
  res.json({
    service: "user-identity-service",
    status: "running",
    endpoints: ["/health", "/auth/login", "/users", "/users/me"]
  });
});

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/", routes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`User Identity Service running on port ${PORT}`);
});
