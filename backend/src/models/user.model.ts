import { User } from "../types";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const defaultAdminHash = bcrypt.hashSync("123456", SALT_ROUNDS);
const defaultDoctorHash = bcrypt.hashSync("123456", SALT_ROUNDS);

export const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@test.com",
    passwordHash: defaultAdminHash,
    role: "admin",
  },
  {
    id: "2",
    name: "Doctor",
    email: "doctor@test.com",
    passwordHash: defaultDoctorHash,
    role: "doctor",
  },
];
