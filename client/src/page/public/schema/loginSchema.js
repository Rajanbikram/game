import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.string().email("Valid email required."),
  password: z.string().min(1, "Password is required."),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Valid email required."),
  password: z.string().min(1, "Password is required."),
  adminPin: z.string().length(5, "PIN must be 5 digits."),
});