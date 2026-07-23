"use server";

import { connectDB } from "@/lib/mongodb";
import { formatZodErrors } from "@/lib/utils";
import { registerUser } from "../lib";
import { registerUserSchema } from "../schemas/userSchema";
import type { RegisterUserDto } from "../types/";

type Result =
  | { success: true }
  | { success: false; message: string; errors?: Record<string, string> };

export default async function register(
  credentials: RegisterUserDto,
): Promise<Result> {
  try {
    const { success, error, data } = registerUserSchema.safeParse(credentials);

    if (!success || !data) {
      return {
        success: false,
        message: "Invalid input data",
        errors: formatZodErrors(error),
      };
    }

    await connectDB();
    const registered = await registerUser(data);

    if (!registered) {
      return {
        success: false,
        message: "Couldn't create your account, please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Registration Action Error:", err);

    return {
      success: false,
      message: "Failed to register, please try again.",
    };
  }
}
