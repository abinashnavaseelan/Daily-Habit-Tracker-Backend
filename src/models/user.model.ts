import mongoose from "mongoose";
import { z } from "zod";

export type UserRole = "user" | "admin";
export interface UserDocument {
  id: string;
  name: string;
  email: string;
  age: number;
  password: string | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  role?: UserRole;
}

export const createUserValidation = z.object({
  body: z.object({
    name: z.string("Please enter a valid name").min(2),
    email: z.email("Please enter a valid email"),
    age: z.number("Please enter a valid age").min(0),
  }),
});

export const registerUserValidation = createUserValidation.extend({
  body: createUserValidation.shape.body.extend({
    password: z.string("Please enter a valid password").min(8),
  }),
});

export const loginUserValidation = z.object({
  body: z.object({
    email: z.email("Please enter a valid email..."),
    password: z.string("Please enter a valid password...").min(8),
  }),
});

export type CreateUserTypeZ = z.infer<typeof createUserValidation>["body"];
export type RegisterUserTypeZ = z.infer<typeof registerUserValidation>["body"];
export type LoginUserTypeZ = z.infer<typeof loginUserValidation>["body"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
