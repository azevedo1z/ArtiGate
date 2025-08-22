export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> =
    new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) return false;

    attempt.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;

    const remaining = attempt.resetTime - Date.now();
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();
