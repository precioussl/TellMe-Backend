const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sql = require("./config/db");
const { generateToken } = require("./middleware/auth");
const app = express();
const routes = require("./routes/index");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`API is running on http://localhost:${port}`);
});

app.post("/login", function (req, res) {
  const data = req.body;
  try {
    sql.query(
      // Code Solution: dont display specific reasons why login failed E.G Wrong password when email is correct, or wrong email.
      // use generic error message like "invalid email or password" for any scenario, limiting the attacksers knowlege of your application

      "SELECT * FROM users WHERE email = $1",
      [data.email],
      async (err, results) => {
        if (err || !results.rows[0]) {
          return res
            .status(401)
            .json({ valid: false, error: err, message: "Email not found" });
        }
        const compare = await bcrypt.compare(
          data.password,
          results.rows[0].password
        );
        if (!compare) {
          return res.json({
            valid: false,
            error: err,
            message: "Incorrect password",
          });
        }
        const token = generateToken(results.rows[0]);
        return res.status(200).json({ token });
      }
    );
  } catch (error) {
    return res
      .status(401)
      .json({ valid: false, error: err, message: "Login failed" });
  }
});
app.post("/register", async function (req, res) {
  const data = req.body;
  try {
    const hashPassword = await bcrypt.hash(data.password, 10);

    sql.query(
      "INSERT INTO users (firstname, lastname, email, password, isadmin) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [data.firstname, data.lastname, data.email, hashPassword, data.isadmin],
      (err, results) => {
        if (err) {
          console.log(data)
          return res.status(401).json({err,message:"Registration failed"});
        }
        return res.status(201).json({ valid: true, data: results.rows[0] });
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ valid: false, error, message: "Registration failed" });
  }
});
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
