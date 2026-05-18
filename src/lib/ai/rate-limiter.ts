type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimits = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
};

const defaultConfig: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = defaultConfig,
): { allowed: boolean; remainingRequests: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimits.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remainingRequests: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetIn: entry.resetTime - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remainingRequests: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

export function getRateLimitMiddleware(config: RateLimitConfig = defaultConfig) {
  return (identifier: string) => {
    const result = checkRateLimit(identifier, config);
    if (!result.allowed) {
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${Math.ceil(result.resetIn / 1000)} seconds.`,
        result.resetIn,
      );
    }
    return result;
  };
}

export class RateLimitError extends Error {
  resetIn: number;

  constructor(message: string, resetIn: number) {
    super(message);
    this.name = 'RateLimitError';
    this.resetIn = resetIn;
  }
}
