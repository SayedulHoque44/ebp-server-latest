import { Request, Response } from "express";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import { RateLimitModel } from "../../app/modules/RateLimiter/RateLimit.model";

/**
 * Middleware generator for different rate limit types
 */
interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  type: "auth" | "api" | string;
}
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: Date;
  timeLeft: string;
}

function createRateLimiter({
  windowMs,
  maxRequests,
  type,
}: RateLimiterOptions) {
  return async (req: any, res: Response, next: () => void) => {
    // Determine identifier based on type
    let identifier: string;
    const ipAddress = req.headers["x-forwarded-for"] || req.ip || "UNKNOWN_IP";
    switch (type) {
      case "auth":
        identifier = `auth:${ipAddress}`;
        break;
      case "api":
        identifier = req.user
          ? `api:user:${(req.user as { id: string }).id}`
          : `api:ip:${ipAddress}`;
        break;
      default:
        identifier = `global:${ipAddress}`;
    }

    const { allowed, remaining, reset, timeLeft }: RateLimitResult =
      await CheckRateLimit(identifier, windowMs, maxRequests);

    if (!allowed) {
      // const retryAfter = Math.ceil(
      //   (reset.getTime() - new Date().getTime()) / 1000,
      // );

      return sendResponse(res, {
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        success: false,
        message: `Too many requests! Limit exceeded. Try again in ${timeLeft}`,
        data: {
          "RateLimit-Limit": maxRequests.toString(),
          "RateLimit-Remaining": remaining.toString(),
          "RateLimit-Reset": Math.floor(reset.getTime() / 1000).toString(),
        },
      });
      // return res.status(429).json({
      //   error: "Too many requests",
      //   message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      //   retryAfter,
      // });
    }

    // Set rate limit headers
    res.set({
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": Math.floor(reset.getTime() / 1000).toString(),
    });

    next();
  };
}

const CheckRateLimit = async (
  identifier: string,
  windowMs: number,
  maxRequests: number,
): Promise<RateLimitResult> => {
  const now: Date = new Date();
  const windowStart: Date = new Date(now.getTime() - windowMs);

  try {
    // First try to update existing record within current window
    let result: any = await RateLimitModel.findOneAndUpdate(
      {
        key: identifier,
        firstRequest: { $gte: windowStart }, // Within current window
      },
      {
        $inc: { count: 1 },
        $set: { lastRequest: now },
      },
      {
        new: true,
        projection: { count: 1, firstRequest: 1 },
      },
    );

    // If no update happened, either window expired or record doesn't exist
    if (!result) {
      result = await RateLimitModel.findOneAndUpdate(
        {
          key: identifier,
          // Only reset if window has expired or doesn't exist
          $or: [
            { firstRequest: { $lt: windowStart } },
            { firstRequest: { $exists: false } },
          ],
        },
        {
          $set: {
            count: 1,
            firstRequest: now,
            lastRequest: now,
          },
        },
        {
          new: true,
          upsert: true,
          projection: { count: 1, firstRequest: 1 },
        },
      );
    }

    if (!result) {
      throw new Error("Rate limit record not found or created");
    }

    // Calculate remaining requests and reset time
    const remaining = Math.max(0, maxRequests - result.count);
    const resetTimestamp = result.firstRequest.getTime() + windowMs;
    const resetTime = new Date(resetTimestamp);
    const secondsLeft = Math.ceil((resetTimestamp - now.getTime()) / 1000);

    // Format the time left in human-readable way
    let timeLeftFormatted = "";
    if (secondsLeft <= 60) {
      timeLeftFormatted = `${secondsLeft} sec`;
    } else {
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;

      if (minutes < 60) {
        timeLeftFormatted = `${minutes} min${
          seconds > 0 ? ` ${seconds} sec` : ""
        }`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        timeLeftFormatted = `${hours} hour${hours > 1 ? "s" : ""}`;
        if (remainingMinutes > 0) {
          timeLeftFormatted += ` ${remainingMinutes} min`;
        }
        if (seconds > 0 && remainingMinutes === 0) {
          timeLeftFormatted += ` ${seconds} sec`;
        }
      }
    }

    return {
      allowed: remaining > 0,
      remaining: remaining,
      reset: resetTime,
      timeLeft: timeLeftFormatted, // Added human-readable time left
    };
  } catch (err) {
    console.error("Rate limit check error:", err);
    // Fail open - allow request if rate limiter fails
    return { allowed: true, remaining: maxRequests, reset: now, timeLeft: "" };
  }
};

// Rate limit configurations
type RateLimiterType = "global" | "auth" | "api";

export const ConfigLimiter: Record<
  RateLimiterType,
  ReturnType<typeof createRateLimiter>
> = {
  global: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    type: "global",
  }),
  auth: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    type: "auth",
  }),
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 500,
    type: "api",
  }),
};

export default createRateLimiter;
