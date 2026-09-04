import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized. Please sign in." 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "biterush_secret_key_2026_secure";
    const token_decode = jwt.verify(token, secret);
    req.body.userId = token_decode.id;
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token. Please sign in again." 
    });
  }
};

export default authMiddleware;
