import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address.").trim(),
  password: z.string().min(1, "Password is required.").max(100),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.email("Please enter a valid email address.").trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required.").max(100),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters.")
    .max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address.").trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required."),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters.")
    .max(100),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TRegisterSchema = z.infer<typeof registerSchema>;
