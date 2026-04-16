import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../utils/jwt.util";
import { AuthUser } from "../types";

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== "object" || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};