import { z } from "zod";

const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const orderItemSchema = z.object({
  productId: z.uuid("Invalid product id."),
  quantity: z.coerce.number().int().positive("Quantity must be positive."),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one order item is required."),
  shippingAddress: z
    .string()
    .trim()
    .min(1, "Shipping address is required.")
    .max(500),
  phone: z.string().trim().min(1, "Phone number is required.").max(30),
  note: z.string().trim().max(1000).optional(),
  shippingFee: z.coerce.number().nonnegative().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  searchTerm: z.string().trim().optional(),
  status: orderStatusSchema.optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "totalAmount", "status"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;
