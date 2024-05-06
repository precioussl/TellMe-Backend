const express = require("express");
const router = express.Router();
const users = require("./users");
const feeds = require("./feeds");
const admin = require("./admin");
const { grantAccess } = require("../middleware/auth");
const checkPrivilege  = require("../middleware/isAdmin");
router.use("/users", grantAccess, users);
router.use("/feeds", grantAccess, feeds);
router.use("/admin", grantAccess, checkPrivilege, admin);

module.exports = router;
