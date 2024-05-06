function checkPrivilege(req, res, next) {
  try {
    if (req.user.isadmin == true) {
      next();
    } else {
      return res.json({
        valid: false,
        error: "You do not have permission to perform this action",
      });
    }
  } catch (error) {
    return res.json({
      valid: false,
      error,
    });
  }
}

module.exports = checkPrivilege;
