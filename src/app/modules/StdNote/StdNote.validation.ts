import { z } from "zod";

const createTrucchi = z.object({
  body: z.object({
    title: z.string({ required_error: "Trucchi Title Required!" }),
    // description: z.string({ required_error: "Trucchi description Required!" }),
    imageUrl: z.string({ required_error: "Trucchi imageUrl Required!" }),
  }),
});

const createTrucchiImage = z.object({
  body: z.object({
    trucchiId: z.string({ required_error: "Trucchi id Required!" }),
    imageUrl: z.string({ required_error: "Trucchi_Image imageUrl Required!" }),
  }),
});

export const trucchiValidationSchemas = { createTrucchi, createTrucchiImage };
