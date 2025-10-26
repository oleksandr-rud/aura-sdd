/**
 * Shared utilities library
 * KISS principle: simple, reusable utility functions
 */

export class Result<T, E = Error> {
  constructor(
    private readonly _value: T | null,
    private readonly _error: E | null
  ) {}

  static ok<T, E>(value: T): Result<T, E> {
    return new Result(value, null)
  }

  static err<T, E>(error: E): Result<T, E> {
    return new Result(null, error)
  }

  isOk(): boolean {
    return this._error === null
  }

  isErr(): boolean {
    return this._error !== null
  }

  unwrap(): T {
    if (this._error) {
      throw this._error
    }
    return this._value!
  }

  unwrapOr(defaultValue: T): T {
    return this._value ?? defaultValue
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isOk() ? Result.ok(fn(this._value!)) : Result.err(this._error!)
  }
}

export class Option<T> {
  constructor(private readonly _value: T | null) {}

  static some<T>(value: T): Option<T> {
    return new Option(value)
  }

  static none<T>(): Option<T> {
    return new Option(null)
  }

  isSome(): boolean {
    return this._value !== null
  }

  isNone(): boolean {
    return this._value === null
  }

  unwrapOr(defaultValue: T): T {
    return this._value ?? defaultValue
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return this.isSome() ? Option.some(fn(this._value!)) : Option.none()
  }
}

export const asyncRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt === maxAttempts) {
        break
      }

      // Simple exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError!
}

export const generateId = (): string => {
  return crypto.randomUUID()
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, "")
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const parseJsonSafe = <T>(json: string): Option<T> => {
  try {
    const parsed = JSON.parse(json) as T
    return Option.some(parsed)
  } catch {
    return Option.none()
  }
}

export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === "string") {
    return value.trim().length === 0
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0
  }
  return false
}
