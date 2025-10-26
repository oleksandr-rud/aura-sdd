import cors from "@fastify/cors"
import sensible from "@fastify/sensible"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import Fastify, { type FastifyError } from "fastify"
import envPlugin from "./plugins/env"
import healthRoutes from "./routes/health"

// Import modules
import { registerAuthRoutes, setupAuthInfrastructure } from "./modules/auth"
import { createChatModule, registerChatRoutes } from "./modules/chat"

export function buildServer() {
  const environment = process.env.NODE_ENV ?? "development"
  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000"

  const app = Fastify({
    logger: {
      level: environment === "production" ? "info" : "debug",
      transport: environment === "development" ? { target: "pino-pretty" } : undefined,
    },
    trustProxy: true,
  })

  // Register plugins
  app.register(envPlugin)
  app.register(cors, {
    origin:
      environment === "development"
        ? [frontendUrl, "http://localhost:3000", "http://localhost:3001"]
        : [frontendUrl],
    credentials: true,
  })

  app.register(sensible)

  app.register(swagger, {
    openapi: {
      info: {
        title: "AI Workspace API",
        description: "AI-powered workspace with CRM, chat, and content generation",
        version: "1.0.0",
        contact: {
          name: "API Support",
          email: "support@aiworkspace.com",
        },
      },
      servers: [
        { url: "http://localhost:4000", description: "Development server" },
        { url: "https://api.aiworkspace.com", description: "Production server" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      tags: [
        { name: "Auth", description: "Authentication and user management" },
        { name: "Chat", description: "AI chat conversations" },
      ],
    },
  })

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  })

  // Global error handler
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500

    // Log error
    request.log.error({
      error,
      url: request.url,
      method: request.method,
      body: request.body,
      headers: request.headers,
    })

    // Send error response
    reply.status(statusCode).send({
      success: false,
      error: {
        code: error.code ?? "INTERNAL_ERROR",
        message: error.message ?? "Internal server error",
        ...(environment === "development" && { stack: error.stack }),
      },
    })
  })

  // Health check endpoint
  app.register(healthRoutes, { prefix: "/health" })

  // Root endpoint
  app.get("/", async () => {
    return {
      name: "AI Chat API",
      description: "AI-powered chat application",
      version: process.env.npm_package_version ?? "1.0.0",
      documentation: "/docs",
      endpoints: {
        auth: "/auth",
        chat: "/chat",
      },
    }
  })

  // Initialize auth infrastructure and get service
  const authService = setupAuthInfrastructure()

  // Initialize chat module and get service
  const chatModule = createChatModule()
  const chatService = chatModule.chatApplicationService

  // Register module routes
  app.register(registerAuthRoutes, { prefix: "/auth", service: authService })
  app.register(registerChatRoutes, { prefix: "/chat", service: chatService })

  // Global request logging
  app.addHook("preHandler", async (request, _reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      userAgent: request.headers["user-agent"],
      ip: request.ip,
    })
  })

  return app
}
