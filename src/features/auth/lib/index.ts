import UserModel from "../models/UserModel";
import type { RegisterUserDto } from "../types";

export const getUserById = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const registerUser = async (data: RegisterUserDto) => {
  const { password, email, name } = data;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return null;
    const created = await UserModel.create({ name, email, password });
    if (!created) return null;

    return created;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};
