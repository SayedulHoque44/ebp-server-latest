"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemValidations = void 0;
const zod_1 = require("zod");
const system_interface_1 = require("./system.interface");
const createSystem = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title Required!" }),
        description: zod_1.z.string({ required_error: "description Required!" }),
        category: zod_1.z.enum(system_interface_1.SystemCategory),
        logo_name: zod_1.z.string().optional(),
        logo_url: zod_1.z.string().optional(),
        primary_color: zod_1.z.string().optional(),
        secondary_color: zod_1.z.string().optional(),
        social_media: zod_1.z
            .array(zod_1.z.object({ name: zod_1.z.string(), url: zod_1.z.string() }))
            .optional(),
        redirect_url: zod_1.z
            .array(zod_1.z.object({ name: zod_1.z.string(), url: zod_1.z.string() }))
            .optional(),
        posters: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string(),
            url: zod_1.z.string(),
            status: zod_1.z.enum(["Active", "Inactive"]),
        }))
            .optional(),
    }),
});
const updateSystem = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title Required!" }).optional(),
        description: zod_1.z
            .string({ required_error: "description Required!" })
            .optional(),
        logo_name: zod_1.z.string().optional(),
        logo_url: zod_1.z.string().optional(),
        primary_color: zod_1.z.string().optional(),
        secondary_color: zod_1.z.string().optional(),
        social_media: zod_1.z
            .array(zod_1.z.object({ name: zod_1.z.string(), url: zod_1.z.string() }))
            .optional(),
        redirect_url: zod_1.z
            .array(zod_1.z.object({ name: zod_1.z.string(), url: zod_1.z.string() }))
            .optional(),
        posters: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string(),
            url: zod_1.z.string(),
            status: zod_1.z.enum(["Active", "Inactive"]),
        }))
            .optional(),
    }),
});
exports.systemValidations = { createSystem, updateSystem };
