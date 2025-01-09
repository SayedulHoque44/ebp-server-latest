import { z } from "zod";
import { SystemCategory } from "./system.interface";

const createSystem = z.object({
  body: z.object({
    title: z.string({ required_error: "Title Required!" }),
    description: z.string({ required_error: "description Required!" }),
    category: z.enum(SystemCategory),
    logo_name: z.string().optional(),
    logo_url: z.string().optional(),
    primary_color: z.string().optional(),
    secondary_color: z.string().optional(),
    social_media: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .optional(),
    redirect_url: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .optional(),
    posters: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          status: z.enum(["Active", "Inactive"]),
        }),
      )
      .optional(),
  }),
});

const updateSystem = z.object({
  body: z.object({
    title: z.string({ required_error: "Title Required!" }).optional(),
    description: z
      .string({ required_error: "description Required!" })
      .optional(),
    logo_name: z.string().optional(),
    logo_url: z.string().optional(),
    primary_color: z.string().optional(),
    secondary_color: z.string().optional(),
    social_media: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .optional(),
    redirect_url: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .optional(),
    posters: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          status: z.enum(["Active", "Inactive"]),
        }),
      )
      .optional(),
  }),
});

export const systemValidations = { createSystem, updateSystem };
