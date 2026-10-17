import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.email("Please enter a valid email address.").trim(),
  password: z.string().min(6, "Password must be at least 6 characters.").max(100),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100).optional(),
  email: z.email("Please enter a valid email address.").trim().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100)
    .optional(),
});

export const createUserSchema = registerUserSchema.extend({
  role: z.enum(["USER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  searchTerm: z.string().trim().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "email", "name", "role"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
