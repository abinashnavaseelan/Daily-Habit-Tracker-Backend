import {
  LoginUserTypeZ,
  RegisterUserTypeZ,
  UserModel,
} from "../models/user.model";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/app.error";
import jwt, { SignOptions } from "jsonwebtoken";

export const registerUserService = async (userData: RegisterUserTypeZ) => {
  const { age, email, name, password } = userData;

  // registration logic - password
  const hashedPassword = await bcrypt.hash(password, 12); // first argument is the password, second argument is how many rounds of encryption we want

  const newUser = {
    name,
    email,
    age,
    password: hashedPassword,
  };

  const createdUser = await UserModel.create(newUser);

  return createdUser;
};

export const loginUserService = async (userCredentials: LoginUserTypeZ) => {
  const { email, password } = userCredentials;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError("JWT_SECRET not set", 500);
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1d") as SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn,
    },
  );

  user.password = undefined;

  return { user, token };
};
