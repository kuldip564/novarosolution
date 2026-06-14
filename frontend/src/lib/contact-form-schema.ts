import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters)."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  services: z.array(z.string()),
  budget: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more — at least 10 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
