import { Router } from "express";
import {
  createUser,
  deleteUserById,
  findAllUsers,
} from "../controllers/user.controller";
import { getUserById } from "../controllers/user.controller";
import { updateById } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { createUserValidation } from "../models/user.model";
import { protect, restrictTo } from "../middleware/auth.middleware";
const router = Router();

router.get("/", protect, restrictTo("admin"), findAllUsers);
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validate(createUserValidation),
  createUser,
);
router.get("/:id", protect, restrictTo("admin"), getUserById);
router.put("/:id", protect, restrictTo("admin"), updateById);
router.delete("/:id", protect, restrictTo("admin"), deleteUserById);
export default router;
