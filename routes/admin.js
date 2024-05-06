const express = require("express");
const router = express.Router();
const sql = require("../config/db");

router.get("/users/all", function (req, res) {
  sql.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error: err });
    }
    return res.status(200).json({ data: results.rows, valid: true });
  });
});

router.get("/users/:id", function (req, res) {
  const id = req.params.id;

  sql.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error: err });
    }
    return res.status(200).json({ valid: true, data: results.rows });
  });
});

router.put("/users/:id", function (req, res) {
  const id = req.params.id;
  const data = req.body;

  sql.query(
    "UPDATE users SET isadmin = $1 WHERE id = $2",
    [data.isadmin, id],
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error: err });
      }
      return res.status(200).send({ valid: true, data: results });
    }
  );
});

router.delete("/users/delete/:id", function (req, res) {
  const id = req.params.id;

  sql.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error: err });
    }
    return res.status(200).json({ valid: true, data: id });
  });
});

router.get("/feeds/all", function (req, res) {
  sql.query(
    "select feeds.id, title, textarea, userid, firstname, lastname, email from feeds join users on userid = users.id ORDER BY id ASC",
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error });
      }
      return res.status(200).json({ valid: true, data: results.rows });
    }
  );
});

router.get("/feeds/:id", function (req, res) {
  const id = req.params.id;

  sql.query(
    "select feeds.id, title, textarea, userid, firstname, lastname, email from feeds join users on userid = users.id WHERE feeds.id = $1",
    [id],
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error });
      }
      return res.status(200).json({ valid: true, data: results.rows });
    }
  );
});

router.delete("/feeds/:id", function (req, res) {
  const id = req.params.id;

  sql.query("DELETE FROM feeds WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error });
    }
    return res.status(200).json({ valid: true, data: id });
  });
});

module.exports = router;
