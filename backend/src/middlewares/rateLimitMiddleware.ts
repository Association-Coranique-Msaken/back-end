import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for authentication endpoints
 * Configurable via environment variables
 * Default: 5 requests per 15 minutes per IP
 */
export const authRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "900000"), // Default: 15 minutes
    max: parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS || "5"), // Default: 5 requests
    message: {
        success: false,
        message: "Too many login attempts from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count successful requests
    skipFailedRequests: false, // Count failed requests
});

/**
 * Moderate rate limiter for password reset endpoints
 * Configurable via environment variables
 * Default: 3 requests per 60 minutes per IP
 */
export const passwordResetRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW_MS || "3600000"), // Default: 60 minutes
    max: parseInt(process.env.RATE_LIMIT_PASSWORD_RESET_MAX_REQUESTS || "3"), // Default: 3 requests
    message: {
        success: false,
        message: "Too many password reset attempts from this IP, please try again after 1 hour.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API rate limiter
 * Configurable via environment variables
 * Default: 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_API_WINDOW_MS || "900000"), // Default: 15 minutes
    max: parseInt(process.env.RATE_LIMIT_API_MAX_REQUESTS || "100"), // Default: 100 requests
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Token refresh rate limiter
 * Configurable via environment variables
 * Default: 10 requests per 15 minutes per IP
 */
export const tokenRefreshRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_TOKEN_REFRESH_WINDOW_MS || "900000"), // Default: 15 minutes
    max: parseInt(process.env.RATE_LIMIT_TOKEN_REFRESH_MAX_REQUESTS || "10"), // Default: 10 requests
    message: {
        success: false,
        message: "Too many token refresh attempts from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
