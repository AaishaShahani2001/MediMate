import jwt from "jsonwebtoken";

export function generateToken(user, secret, expiresIn = "7d") {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    secret,
    { expiresIn }
  );
}
