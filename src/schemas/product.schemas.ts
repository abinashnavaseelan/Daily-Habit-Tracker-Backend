import { z } from "zod";

export const createProductValidation = z.object({
  body: z.object({
    name: z.string().min(3),
    price: z.number().min(0),
    description: z.string().min(5),
    stock: z.number().min(0),
    category: z.string().min(2),
  }),
});

export type CreateProductTypeZ = z.infer<
  typeof createProductValidation
>["body"];
