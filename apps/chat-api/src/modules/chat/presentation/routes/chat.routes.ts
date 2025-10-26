/**
 * Chat Routes
 * Fastify route definitions for chat endpoints
 */

import type { FastifyInstance, FastifyPluginOptions } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { ChatController } from "../controllers/chat.controller"
import { chatDTOs } from "../dto/chat.dto"

// Simple auth middleware - in a real app, this would be more sophisticated
const authenticate = async (request: any, reply: any) => {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    })
  }

  // For now, just set a mock user
  // In a real implementation, you'd validate the JWT token
  request.user = {
    id: "mock-user-id",
    email: "user@example.com",
    name: "Mock User",
  }
}

export async function chatRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  // Initialize controller
  const chatController = new ChatController(options.chatApplicationService)

  // Create a typed instance with Zod provider
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  /**
   * List user's chat sessions
   * GET /chat/sessions
   */
  app.get(
    "/sessions",
    {
      preHandler: authenticate,
      schema: {
        description: "List user's chat sessions",
        tags: ["Chat"],
        querystring: chatDTOs.pagination.extend({
          activeOnly: { type: "boolean", default: false },
        }),
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  sessions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        userId: { type: "string" },
                        title: { type: "string" },
                        context: { type: "string" },
                        aiProvider: { enum: ["openai", "claude"] },
                        aiModel: { type: "string" },
                        isActive: { type: "boolean" },
                        createdAt: { type: "string" },
                        updatedAt: { type: "string" },
                      },
                    },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "number" },
                      limit: { type: "number" },
                      total: { type: "number" },
                      totalPages: { type: "number" },
                    },
                  },
                },
              },
              message: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.listSessions
  )

  /**
   * Create a new chat session
   * POST /chat/sessions
   */
  app.post(
    "/sessions",
    {
      preHandler: authenticate,
      schema: {
        description: "Create a new chat session",
        tags: ["Chat"],
        body: chatDTOs.createSession,
        response: {
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  session: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      userId: { type: "string" },
                      title: { type: "string" },
                      context: { type: "string" },
                      aiProvider: { enum: ["openai", "claude"] },
                      aiModel: { type: "string" },
                      isActive: { type: "boolean" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                    },
                  },
                },
              },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.createSession
  )

  /**
   * Get a specific chat session
   * GET /chat/sessions/:sessionId
   */
  app.get(
    "/sessions/:sessionId",
    {
      preHandler: authenticate,
      schema: {
        description: "Get a specific chat session",
        tags: ["Chat"],
        params: {
          type: "object",
          properties: {
            sessionId: { type: "string", format: "uuid" },
          },
          required: ["sessionId"],
        },
        querystring: {
          type: "object",
          properties: {
            includeMessages: { type: "boolean", default: false },
            page: { type: "number", minimum: 1, default: 1 },
            limit: { type: "number", minimum: 1, maximum: 100, default: 20 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  session: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      userId: { type: "string" },
                      title: { type: "string" },
                      context: { type: "string" },
                      aiProvider: { enum: ["openai", "claude"] },
                      aiModel: { type: "string" },
                      isActive: { type: "boolean" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                    },
                  },
                  messages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        sessionId: { type: "string" },
                        role: { enum: ["user", "assistant", "system"] },
                        content: { type: "string" },
                        tokens: { type: "number" },
                        model: { type: "string" },
                        createdAt: { type: "string" },
                      },
                    },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "number" },
                      limit: { type: "number" },
                      total: { type: "number" },
                      totalPages: { type: "number" },
                    },
                  },
                },
              },
              message: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          403: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.getSession
  )

  /**
   * Send a message in a chat session
   * POST /chat/sessions/:sessionId/messages
   */
  app.post(
    "/sessions/:sessionId/messages",
    {
      preHandler: authenticate,
      schema: {
        description: "Send a message in a chat session",
        tags: ["Chat"],
        params: {
          type: "object",
          properties: {
            sessionId: { type: "string", format: "uuid" },
          },
          required: ["sessionId"],
        },
        body: chatDTOs.sendMessage,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  userMessage: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      sessionId: { type: "string" },
                      role: { enum: ["user", "system"] },
                      content: { type: "string" },
                      createdAt: { type: "string" },
                    },
                  },
                  aiMessage: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      sessionId: { type: "string" },
                      role: { enum: ["assistant"] },
                      content: { type: "string" },
                      model: { type: "string" },
                      tokens: { type: "number" },
                      createdAt: { type: "string" },
                    },
                  },
                },
              },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          403: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.sendMessage
  )

  /**
   * Delete a chat session
   * DELETE /chat/sessions/:sessionId
   */
  app.delete(
    "/sessions/:sessionId",
    {
      preHandler: authenticate,
      schema: {
        description: "Delete a chat session",
        tags: ["Chat"],
        params: {
          type: "object",
          properties: {
            sessionId: { type: "string", format: "uuid" },
          },
          required: ["sessionId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          403: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.deleteSession
  )

  /**
   * Update a chat session
   * PATCH /chat/sessions/:sessionId
   */
  app.patch(
    "/sessions/:sessionId",
    {
      preHandler: authenticate,
      schema: {
        description: "Update a chat session",
        tags: ["Chat"],
        params: {
          type: "object",
          properties: {
            sessionId: { type: "string", format: "uuid" },
          },
          required: ["sessionId"],
        },
        body: chatDTOs.updateSession,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  session: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      userId: { type: "string" },
                      title: { type: "string" },
                      context: { type: "string" },
                      aiProvider: { enum: ["openai", "claude"] },
                      aiModel: { type: "string" },
                      isActive: { type: "boolean" },
                      createdAt: { type: "string" },
                      updatedAt: { type: "string" },
                    },
                  },
                },
              },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          403: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.updateSession
  )

  /**
   * Get session statistics
   * GET /chat/sessions/:sessionId/stats
   */
  app.get(
    "/sessions/:sessionId/stats",
    {
      preHandler: authenticate,
      schema: {
        description: "Get chat session statistics",
        tags: ["Chat"],
        params: {
          type: "object",
          properties: {
            sessionId: { type: "string", format: "uuid" },
          },
          required: ["sessionId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "object",
                properties: {
                  messageCount: { type: "number" },
                  totalTokens: { type: "number" },
                  firstMessageAt: { type: "string" },
                  lastMessageAt: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          403: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    chatController.getSessionStats
  )

  /**
   * Health check for chat service
   * GET /chat/health
   */
  app.get(
    "/health",
    {
      schema: {
        description: "Health check for chat service",
        tags: ["Chat", "Health"],
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" },
              service: { type: "string" },
            },
          },
        },
      },
    },
    async (_request, _reply) => {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "chat",
      }
    }
  )

  done()
}

// Route registration helper
export const registerChatRoutes = (fastify: FastifyInstance, chatApplicationService: any) => {
  fastify.register(chatRoutes, {
    prefix: "/chat",
    chatApplicationService,
  })
}
