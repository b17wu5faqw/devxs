import { z } from "zod";

export const createTransactionSchema = z.object({
  digits: z.string(),
  amount: z.number(),
});

export type CreateTransaction = z.infer<typeof createTransactionSchema>;
