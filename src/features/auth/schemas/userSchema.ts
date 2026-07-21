import z from "zod";

// base user schema

export const baseUserSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email({ message: "Email is required" }),
  password: z.string().min(8, "Password is required"),
});

// user schema for registration

export const registerUserSchema = baseUserSchema
  .extend({
    passwordConfirmation: z
      .string()
      .min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

// user schema for login

export const loginUserSchema = baseUserSchema.omit({ name: true });
