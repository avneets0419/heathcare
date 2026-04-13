import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_test_secret_for_development";
const JWT_EXPIRES_IN = "1d";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): object | string => {
  return jwt.verify(token, JWT_SECRET);
};
