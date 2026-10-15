import { z } from "zod";

const unitSchema = z.enum(["KG", "GRAM", "PIECE", "DOZEN"]);

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(150),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().nonnegative("Price cannot be negative."),
  stock: z.coerce.number().int().nonnegative().optional(),
  unit: unitSchema.optional(),
  category: z.string().trim().max(100).optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  searchTerm: z.string().trim().optional(),
  category: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "name", "price", "stock"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type TCreateProductSchema = z.infer<typeof createProductSchema>;
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>;
