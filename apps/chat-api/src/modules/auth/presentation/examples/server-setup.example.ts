/**
 * Example: Server Setup with Auth Module
 * Shows how to integrate the auth presentation layer with a Fastify server
 */

import Fastify from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { AuthApplicationService, registerAuthRoutes, setupAuthInfrastructure } from "../.."

async function createServer() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>()

  try {
    // Setup auth infrastructure (database, email, cache, etc.)
    const authInfrastructure = await setupAuthInfrastructure({
      database: {
        url: process.env.DATABASE_URL || "sqlite:memory:",
      },
      jwt: {
        secret: process.env.JWT_SECRET || "your-secret-key",
        expiresIn: "1h",
        refreshExpiresIn: "7d",
      },
      email: {
        provider: "smtp",
        config: {
          host: process.env.SMTP_HOST,
          port: Number.parseInt(process.env.SMTP_PORT || "587"),
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      cache: {
        provider: "memory",
        ttl: 3600, // 1 hour
      },
    })

    // Create auth application service
    const authApplicationService = new AuthApplicationService(
      authInfrastructure.userRepository,
      authInfrastructure.authService,
      authInfrastructure.emailService,
      authInfrastructure.cacheService
    )

    // Register auth routes
    registerAuthRoutes(app, authApplicationService)

    // Register other routes...
    app.get("/", async (_request, _reply) => {
      return { message: "API Server Running" }
    })

    // Health check endpoint
    app.get("/health", async (_request, _reply) => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          auth: "healthy",
          database: "connected",
        },
      }
    })

    return app
  } catch (error) {
    console.error("Failed to create server:", error)
    throw error
  }
}

// Start server
async function start() {
  try {
    const app = await createServer()

    const port = Number.parseInt(process.env.PORT || "3000")
    const host = process.env.HOST || "0.0.0.0"

    await app.listen({ port, host })
    console.log(`🚀 Server running on http://${host}:${port}`)
    console.log(`📚 API Documentation: http://${host}:${port}/docs`)
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start()
}

export { createServer, start }
