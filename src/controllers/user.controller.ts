import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { validate } from "../middleware/validate.middleware";
import { CreateUserTypeZ, RegisterUserTypeZ } from "../models/user.model";

export const createUser = async (
  req: Request<{}, {}, RegisterUserTypeZ>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, age, password } = req.body;
    const newUser = await userService.createUser(name, email, age, password);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const changeUser = await userService.updateById(req.params.id, req.body);
    res.status(200).json(changeUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id as string;
    const user = await userService.deleteUserService(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
