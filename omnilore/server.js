require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; // Store securely in .env

// Mock user database
const users = [
  { id: "owlsrus", password: bcrypt.hashSync("SDGbook25", 10) }
];

// Login route
app.post("/api/login", async (req, res) => {
  const { userID, password } = req.body;

  const user = users.find((u) => u.id === userID);
  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Protected route example
app.get("/api/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Access granted", user: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





// example code generation

{/* <button id="db-link">Open Link</button> */}

{/* <script>
    document.getElementById("db-link”).onclick = function() {
        var now = new Date();
        // Extract the current UTC date (YYYY-MM-DD)
        var utcDate = now.toISOString().split("T")[0];
        var token = "somekey" + utcDate;
        // Encode the token in Base64
        var base64 = window.btoa(token);
        // Build the URL with the token as a query parameter
        var url = "https://db.omnilore.org/login?token=" + encodeURIComponent(base64);
    };
<script> */}



// example code generation

{/* <button id="db-link">Open Link</button>

<script>

    document.getElementById("db-link”).onclick = function() {
        var now = new Date();
        // Extract the current UTC date (YYYY-MM-DD)
        var utcDate = now.toISOString().split("T")[0];
        var token = "somekey" + utcDate;
        // Encode the token in Base64
        var base64 = window.btoa(token);
        // Build the URL with the token as a query parameter
        var url = "https://db.omnilore.org/login?token=" + encodeURIComponent(base64);
        // Open the URL in a new window/tab
        window.open(url, "_blank");
    };

</script> */}