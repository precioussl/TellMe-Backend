const express = require("express");
const router = express.Router();
const sql = require("../config/db");
// Require controller modules.

router.get("/", function (req, res) {
  sql.query("select * from feeds ORDER BY id ASC", (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error: err });
    }
    return res.status(200).json({ valid: true, data: results.rows });
  });
});

router.get("/:id", function (req, res) {
  sql.query(
    "select * from feeds where id = $1",
    [req.params.id],
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error: err });
      }
      return res.status(200).json({ valid: true, data: results.rows });
    }
  );
});

router.post("/create", function (req, res) {
  const data = req.body;
  /*  
  Solution:
  Use the token details on query to create feeds based on login user.
  "INSERT INTO feeds (title, textarea, userid) VALUES ($1, $2, $3) RETURNING *",
    [data.title, data.textarea, req.user.id],
  
  */
  sql.query(
    "INSERT INTO feeds (title, textarea, userid) VALUES ($1, $2, $3) RETURNING *",
    [data.title, data.textarea, req.query.userid],
    (err, results) => {
      if (err) {
        return res.status(400).json({ valid: false, error: err });
      }
      return res.status(201).json({ valid: true, data: results.rows[0] });
    }
  );
});

router.put("/:id", function (req, res) {
  const id = req.params.id;
  /*  
  Solution:
  Use the token details on query to ensure that the user only update his own feeds.
  "UPDATE feeds SET title = $1, textarea = $2 WHERE id = $3 AND userid = $4",
    [req.body.title, req.body.textarea, id, req.user.id],
  
  */

  sql.query(
    "UPDATE feeds SET title = $1, textarea = $2 WHERE id = $3 AND userid = $4",
    [req.body.title, req.body.textarea, id, req.query.userid],
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error: err });
      }
      return res.status(200).json({ valid: true, data: results });
    }
  );
});

router.delete("/:id", function (req, res) {
  const id = req.params.id;
  /*  
  Solution:
  Use the token details on query to ensure that the user only update his own feeds.
  "DELETE FROM feeds WHERE id = $1 AND userid = $2", [id, req.user.id]
  
  */
  sql.query("DELETE FROM feeds WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    return res.status(200).json({ valid: true, data: id });
  });
});

module.exports = router;
