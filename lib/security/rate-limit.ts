type RateLimitStore = {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(identifier: string, limit = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = store[identifier]

  if (!record || now > record.resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function clearRateLimit(identifier: string): void {
  delete store[identifier]
}
