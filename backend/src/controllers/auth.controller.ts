import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.registerUser(req.body);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      if (error.message === "User already exists with this email.") {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.loginUser(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Invalid email or password." || error.message === "Password is required.") {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

export const authController = new AuthController();
