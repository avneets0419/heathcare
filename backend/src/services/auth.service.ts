import { findUserByEmail, createUser } from "../models/user.model";
import { RegisterPayload, LoginPayload, AuthUser } from "../types";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.util";

export class AuthService {
  public async registerUser(payload: RegisterPayload) {
    const existingUser = await findUserByEmail(payload.email);
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    if (!payload.password) throw new Error("Password is required for registration.");
    const passwordHash = await bcrypt.hash(payload.password, 10);

    const newUser = await createUser({
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: "patient",
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  public async loginUser(payload: LoginPayload) {
    if (!payload.password) throw new Error("Password is required.");

    const user = await findUserByEmail(payload.email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const tokenPayload: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role as "admin" | "doctor" | "patient",
    };
    const token = generateToken(tokenPayload);

    return {
      token,
    };
  }
}

export const authService = new AuthService();