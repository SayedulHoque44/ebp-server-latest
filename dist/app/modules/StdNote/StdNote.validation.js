"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trucchiValidationSchemas = void 0;
const zod_1 = require("zod");
const createTrucchi = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Trucchi Title Required!" }),
        // description: z.string({ required_error: "Trucchi description Required!" }),
        imageUrl: zod_1.z.string({ required_error: "Trucchi imageUrl Required!" }),
    }),
});
const createTrucchiImage = zod_1.z.object({
    body: zod_1.z.object({
        trucchiId: zod_1.z.string({ required_error: "Trucchi id Required!" }),
        imageUrl: zod_1.z.string({ required_error: "Trucchi_Image imageUrl Required!" }),
    }),
});
exports.trucchiValidationSchemas = { createTrucchi, createTrucchiImage };
