import type z from "zod";
import type {
  baseUserSchema,
  loginUserSchema,
  registerUserSchema,
} from "../schemas/userSchema";

export type User = z.infer<typeof baseUserSchema>;
export type RegisterUserDto = z.infer<typeof registerUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
