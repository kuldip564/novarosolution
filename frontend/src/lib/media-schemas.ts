import { z } from "zod";

export const cloudinaryAssetFormSchema = z
  .object({
    secureUrl: z.string().min(1),
    publicId: z.string().nullable(),
  })
  .nullable()
  .optional();

export const cloudinaryAssetDefault = null;
