import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email"),
  services: z.array(z.string().trim().min(1)).default([]),
  budget: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters"),
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fields[key]) {
          fields[key] = issue.message;
        }
      }

      res.status(400).json({
        ok: false,
        error: "Validation failed",
        fields,
      });
      return;
    }

    const { name, email, services, budget, message } = parsed.data;

    await prisma.lead.create({
      data: {
        name,
        email,
        services,
        budget: budget ?? null,
        message,
        status: "NEW",
      },
    });

    res.status(201).json({
      ok: true,
      message:
        "Thanks — we received your message and will reply within one business day.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
