import { users } from "../models/user.model";
import { RegisterPayload, LoginPayload, User } from "../types";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.util";

export class AuthService {
  public async registerUser(payload: RegisterPayload) {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === payload.email);
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    // Hash password
    if (!payload.password) throw new Error("Password is required for registration.");
    const passwordHash = await bcrypt.hash(payload.password, 10);

    // Create user
    const newUser: User = {
      id: String(users.length + 1), // Simple ID generator
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: "patient", // Only patients can register
    };

    users.push(newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  public async loginUser(payload: LoginPayload) {
    if (!payload.password) throw new Error("Password is required.");

    // Find user
    const user = users.find((u) => u.email === payload.email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(tokenPayload);

    return {
      token,
      user: tokenPayload,
    };
  }
}

export const authService = new AuthService();
