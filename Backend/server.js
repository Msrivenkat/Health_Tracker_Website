const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "*************",
  database: "************",
});

db.connect((err) => {
  if (err) {
    console.log("DB Connection Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ✅ SIGNUP API
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.json({ message: "User Already Exists" });
    return res.json({ message: "Signup Successful" });
  });
});

// ✅ LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name and password required" });
    }

    const sql = "SELECT * FROM users WHERE name = ?";
    db.query(sql, [name], async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Server Error" });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: "No User Found" });
      }

      const storedPassword = data[0].password;
      const isMatch = await bcrypt.compare(password, storedPassword);

      if (!isMatch) {
        return res.status(401).json({ error: "Wrong Password" });
      }

      return res.status(200).json({
        message: "Login Successful",
        success: true,
        user: {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
        },
      });
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("✅ Server Running on port 3001");
});
