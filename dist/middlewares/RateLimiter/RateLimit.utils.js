"use strict";
// import { RateLimitModel } from "../../app/modules/RateLimiter/RateLimit.model";
// import createRateLimiter, { RateLimitResult } from "./CreateRateLimiter";
// async function checkRateLimit(
//   identifier: string,
//   windowMs: number,
//   maxRequests: number,
// ): Promise<RateLimitResult> {
//   const now: Date = new Date();
//   const windowStart: Date = new Date(now.getTime() - windowMs);
//   try {
//     // First try to update existing record within current window
//     let result: any = await RateLimitModel.findOneAndUpdate(
//       {
//         key: identifier,
//         firstRequest: { $gte: windowStart }, // Within current window
//       },
//       {
//         $inc: { count: 1 },
//         $set: { lastRequest: now },
//       },
//       {
//         new: true,
//         projection: { count: 1, firstRequest: 1 },
//       },
//     );
//     // If no update happened, either window expired or record doesn't exist
//     if (!result) {
//       result = await RateLimitModel.findOneAndUpdate(
//         {
//           key: identifier,
//           // Only reset if window has expired or doesn't exist
//           $or: [
//             { firstRequest: { $lt: windowStart } },
//             { firstRequest: { $exists: false } },
//           ],
//         },
//         {
//           $set: {
//             count: 1,
//             firstRequest: now,
//             lastRequest: now,
//           },
//         },
//         {
//           new: true,
//           upsert: true,
//           projection: { count: 1, firstRequest: 1 },
//         },
//       );
//     }
//     if (!result) {
//       throw new Error("Rate limit record not found or created");
//     }
//     // Calculate remaining requests and reset time
//     const remaining = Math.max(0, maxRequests - result.count);
//     const resetTimestamp = result.firstRequest.getTime() + windowMs;
//     const resetTime = new Date(resetTimestamp);
//     const secondsLeft = Math.ceil((resetTimestamp - now.getTime()) / 1000);
//     // Format the time left in human-readable way
//     let timeLeftFormatted = "";
//     if (secondsLeft <= 60) {
//       timeLeftFormatted = `${secondsLeft} sec`;
//     } else {
//       const minutes = Math.floor(secondsLeft / 60);
//       const seconds = secondsLeft % 60;
//       if (minutes < 60) {
//         timeLeftFormatted = `${minutes} min${
//           seconds > 0 ? ` ${seconds} sec` : ""
//         }`;
//       } else {
//         const hours = Math.floor(minutes / 60);
//         const remainingMinutes = minutes % 60;
//         timeLeftFormatted = `${hours} hour${hours > 1 ? "s" : ""}`;
//         if (remainingMinutes > 0) {
//           timeLeftFormatted += ` ${remainingMinutes} min`;
//         }
//         if (seconds > 0 && remainingMinutes === 0) {
//           timeLeftFormatted += ` ${seconds} sec`;
//         }
//       }
//     }
//     return {
//       allowed: remaining > 0,
//       remaining: remaining,
//       reset: resetTime,
//       timeLeft: timeLeftFormatted, // Added human-readable time left
//     };
//   } catch (err) {
//     console.error("Rate limit check error:", err);
//     // Fail open - allow request if rate limiter fails
//     return { allowed: true, remaining: maxRequests, reset: now, timeLeft: "" };
//   }
// }
// // Rate limit configurations
// type RateLimiterType = "global" | "auth" | "api";
// const ConfigLimiter: Record<
//   RateLimiterType,
//   ReturnType<typeof createRateLimiter>
// > = {
//   global: createRateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     maxRequests: 1000,
//     type: "global",
//   }),
//   auth: createRateLimiter({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     maxRequests: 5,
//     type: "auth",
//   }),
//   api: createRateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     maxRequests: 500,
//     type: "api",
//   }),
// };
// export const RateLimiterUtils = {
//   checkRateLimit,
//   ConfigLimiter,
// };
