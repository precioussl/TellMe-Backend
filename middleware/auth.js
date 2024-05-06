const jwt = require("jsonwebtoken");

function generateToken(payload) {
  try {
    return jwt.sign(payload, process.env.secretKey, { expiresIn: "1h" });
  } catch (error) {
    console.log(error);
  }
}

function grantAccess(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .json({ valid: false, error: "Authorization header missing" })
      .status(403);
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .json({ valid: false, error: "Token not found in Authorization header" })
      .status(403);
  }
  try {
    const validate = jwt.verify(token, process.env.secretKey);
    /* 
    Solution: remove user password details from token before adding verified token to req.user for identification of each logged in user
    delete validate.password
    */
    req.user = validate;

    next();
  } catch (error) {
    
    return res.json({ valid: false, error: error.message }).status(403);
  }
}

module.exports = { generateToken, grantAccess };
