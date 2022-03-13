const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

function requireAuth(req, res, next) {
  const token = req.cookies["access-token"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    jwt.verify(token, SECRET, async (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const { sub, email } = decoded;
      req.user = { userId: sub, email };
      next();
    });
  } catch (e) {
    return res.status(500).json(e);
  }
}

module.exports = requireAuth;
