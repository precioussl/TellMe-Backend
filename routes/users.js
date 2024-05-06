const express = require("express");
const router = express.Router();
const sql = require("../config/db");

router.get("/myfeeds", function (req, res) {
  /*  
  Solution:
  Use the token details on query to ensure that a regular user can only retrieves his own feeds.
  SELECT * FROM feeds WHERE userid = $1", [req.user.id]
  
  */
  sql.query(
    "SELECT * FROM feeds WHERE userid = $1",
    [req.query.userid],
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error: error });
      }
      return res.status(200).send({ valid: true, data: results.rows });
    }
  );
});
router.put("/:id", function (req, res) {
  const id = req.params.id;
  const data = req.body;
  /*  
  Solution:
  Use the token details on query to ensure that a regular user can only updates his own data nad remove user id as a param.
  "UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4",
    [data.firstName, data.lastName, data.email, req.user.id],
  
  */
  sql.query(
    "UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4",
    [data.firstname, data.lastname, data.email, id],
    (error, results) => {
      if (error) {
        return res.status(400).json({ valid: false, error: err });
      }
      return res.status(200).send({ valid: true, data: results });
    }
  );
});

router.get("/profile/:id", function (req, res) {
  const id = req.params.id;
  /*  
  Solution:
  Alter the query to limit user details shown.
  SELECT firstname, lastname, email FROM users WHERE id = $1", [id]
  
  */
  sql.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error: err });
    }
    return res.status(200).send({ valid: true, data: results.rows });
  });
});

router.delete("/deactivate/:id", function (req, res) {
  const id = req.params.id;
  /*  
  Solution:
  Use the token details on query to ensure that a regular user can only deactivate itself.
  "DELETE FROM users WHERE id = $1", [req.user.id]
  
  */
  sql.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return res.status(400).json({ valid: false, error: err });
    }
    return res.status(200).send({ valid: true, data: id });
  });
});

module.exports = router;
