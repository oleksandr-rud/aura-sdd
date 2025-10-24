import Fastify, { FastifyError } from "fastify";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import envPlugin from "./plugins/env";
import healthRoutes from "./routes/health";

// Import modules
import { registerAuthRoutes } from './modules/auth'
import { registerChatRoutes } from './modules/chat'
import { registerCrmRoutes } from './modules/crm'
import { registerContentRoutes } from './modules/content'
import { registerWorkspaceRoutes } from './modules/workspace'

// Import infrastructure setup
import { AuthInfrastructureContainer } from './modules/auth/infrastructure'
import { ChatInfrastructureContainer } from './modules/chat/infrastructure'
import { CrmInfrastructureContainer } from './modules/crm/infrastructure'
import { ContentInfrastructureContainer } from './modules/content/infrastructure'
import { WorkspaceInfrastructureContainer } from './modules/workspace/infrastructure'

export function buildServer() {
  const environment = process.env.NODE_ENV ?? 'development'
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000'

  const app = Fastify({
    logger: {
      level: environment === "production" ? "info" : "debug",
      transport: environment === 'development'
        ? { target: 'pino-pretty' }
        : undefined
    },
    trustProxy: true
  });

  // Register plugins
  app.register(envPlugin);
  app.register(cors, {
    origin: environment === 'development'
      ? [frontendUrl, 'http://localhost:3000', 'http://localhost:3001']
      : [frontendUrl],
    credentials: true
  });

  app.register(sensible);

  app.register(swagger, {
    openapi: {
      info: {
        title: "AI Workspace API",
        description: 'AI-powered workspace with CRM, chat, and content generation',
        version: "1.0.0",
        contact: {
          name: 'API Support',
          email: 'support@aiworkspace.com'
        }
      },
      servers: [
        { url: `http://localhost:4000`, description: 'Development server' },
        { url: 'https://api.aiworkspace.com', description: 'Production server' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      tags: [
        { name: 'Auth', description: 'Authentication and user management' },
        { name: 'Chat', description: 'AI chat conversations' },
        { name: 'CRM', description: 'Customer relationship management' },
        { name: 'Content', description: 'Content generation and analysis' },
        { name: 'Workspace', description: 'Workspace and team management' }
      ]
    }
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });

  // Global error handler
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500

    // Log error
    request.log.error({
      error,
      url: request.url,
      method: request.method,
      body: request.body,
      headers: request.headers
    })

    // Send error response
    reply.status(statusCode).send({
      success: false,
      error: {
        code: error.code ?? 'INTERNAL_ERROR',
        message: error.message ?? 'Internal server error',
        ...(environment === 'development' && { stack: error.stack })
      }
    })
  })

  // Health check endpoint
  app.register(healthRoutes, { prefix: "/health" });

  // Root endpoint
  app.get('/', async () => {
    return {
      name: 'AI Workspace API',
      description: 'AI-powered workspace with CRM, chat, and content generation',
      version: process.env.npm_package_version ?? '1.0.0',
      documentation: '/docs',
      endpoints: {
        auth: '/auth',
        chat: '/chat',
        crm: '/crm',
        content: '/content',
        workspace: '/workspace'
      }
    }
  })

  // Initialize infrastructure containers
  const authContainer = AuthInfrastructureContainer.getInstance()
  const chatContainer = ChatInfrastructureContainer.getInstance()
  const crmContainer = CrmInfrastructureContainer.getInstance()
  const contentContainer = ContentInfrastructureContainer.getInstance()
  const workspaceContainer = WorkspaceInfrastructureContainer.getInstance()

  // Get application services
  const authService = authContainer.getApplicationService()
  const chatService = chatContainer.getApplicationService()
  const crmService = crmContainer.getApplicationService()
  const contentService = contentContainer.getApplicationService()
  const workspaceService = workspaceContainer.getApplicationService()

  // Register module routes
  app.register(registerAuthRoutes, { prefix: '/auth', service: authService })
  app.register(registerChatRoutes, { prefix: '/chat', service: chatService })
  app.register(registerCrmRoutes, { prefix: '/crm', service: crmService })
  app.register(registerContentRoutes, { prefix: '/content', service: contentService })
  app.register(registerWorkspaceRoutes, { prefix: '/workspace', service: workspaceService })

  // Global request logging
  app.addHook('preHandler', async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    })
  })

  return app;
}
