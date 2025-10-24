/**
 * Chat Module Integration Example
 * Demonstrates how to integrate and use the chat module
 */

import { FastifyInstance } from 'fastify'
import { createChatModule, registerChatRoutes } from '../index'

/**
 * Example: Setting up the chat module in a Fastify application
 */
export async function setupChatModule(fastify: FastifyInstance) {
  // 1. Create chat module with dependencies
  const chatModule = createChatModule()

  // 2. Register chat routes
  registerChatRoutes(fastify, chatModule.chatApplicationService)

  // 3. Optional: Add middleware for authentication
  fastify.addHook('preHandler', async (request, reply) => {
    // Add your authentication logic here
    // The chat module expects request.user to be set
    if (request.url.startsWith('/chat/') && !request.url.includes('/health')) {
      // Example authentication logic
      const authHeader = request.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        })
      }

      // In a real app, validate JWT token and set user
      request.user = {
        id: 'example-user-id',
        email: 'user@example.com',
        name: 'Example User'
      }
    }
  })

  console.log('✅ Chat module registered successfully')
  return chatModule
}

/**
 * Example: Programmatic usage of chat services
 */
export async function demonstrateChatUsage() {
  const chatModule = createChatModule()

  try {
    // 1. Create a new chat session
    console.log('📝 Creating new chat session...')
    const sessionResult = await chatModule.chatApplicationService.createSession({
      userId: 'demo-user-123',
      title: 'Customer Support Chat',
      aiProvider: 'openai',
      aiModel: 'gpt-3.5-turbo',
      context: 'You are a helpful customer support assistant. Be friendly and professional.'
    })

    if (sessionResult.isErr()) {
      console.error('❌ Failed to create session:', sessionResult.unwrapErr().message)
      return
    }

    const session = sessionResult.unwrap().session
    console.log(`✅ Session created: ${session.id}`)

    // 2. Send first message
    console.log('💬 Sending first message...')
    const messageResult1 = await chatModule.chatApplicationService.sendMessage({
      sessionId: session.id,
      content: 'Hello! I need help with my recent order.',
      userId: 'demo-user-123'
    })

    if (messageResult1.isErr()) {
      console.error('❌ Failed to send message:', messageResult1.unwrapErr().message)
      return
    }

    const message1 = messageResult1.unwrap()
    console.log(`✅ Message sent. AI response: ${message1.aiMessage?.content?.substring(0, 100)}...`)

    // 3. Send follow-up message
    console.log('💬 Sending follow-up message...')
    const messageResult2 = await chatModule.chatApplicationService.sendMessage({
      sessionId: session.id,
      content: 'My order number is #12345 and it hasn\'t arrived yet.',
      userId: 'demo-user-123'
    })

    if (messageResult2.isErr()) {
      console.error('❌ Failed to send message:', messageResult2.unwrapErr().message)
      return
    }

    const message2 = messageResult2.unwrap()
    console.log(`✅ Follow-up sent. AI response: ${message2.aiMessage?.content?.substring(0, 100)}...`)

    // 4. Get session with all messages
    console.log('📋 Retrieving session with messages...')
    const fullSessionResult = await chatModule.chatApplicationService.getSession({
      sessionId: session.id,
      userId: 'demo-user-123',
      includeMessages: true
    })

    if (fullSessionResult.isErr()) {
      console.error('❌ Failed to get session:', fullSessionResult.unwrapErr().message)
      return
    }

    const fullSession = fullSessionResult.unwrap()
    console.log(`✅ Retrieved session with ${fullSession.messages?.length} messages`)

    // 5. Get session statistics
    console.log('📊 Getting session statistics...')
    const statsResult = await chatModule.chatApplicationService.getSessionStats(
      session.id,
      'demo-user-123'
    )

    if (statsResult.isErr()) {
      console.error('❌ Failed to get stats:', statsResult.unwrapErr().message)
      return
    }

    const stats = statsResult.unwrap()
    console.log(`✅ Session stats: ${stats.messageCount} messages, ${stats.totalTokens} total tokens`)

    // 6. List all user sessions
    console.log('📚 Listing user sessions...')
    const listResult = await chatModule.chatApplicationService.listSessions({
      userId: 'demo-user-123',
      page: 1,
      limit: 10
    })

    if (listResult.isErr()) {
      console.error('❌ Failed to list sessions:', listResult.unwrapErr().message)
      return
    }

    const sessionList = listResult.unwrap()
    console.log(`✅ Found ${sessionList.sessions.length} sessions`)

    // 7. Update session
    console.log('✏️ Updating session title...')
    const updateResult = await chatModule.chatApplicationService.updateSession({
      sessionId: session.id,
      userId: 'demo-user-123',
      updates: {
        title: 'Updated Customer Support Chat',
        context: 'You are a helpful customer support assistant specializing in order inquiries.'
      }
    })

    if (updateResult.isErr()) {
      console.error('❌ Failed to update session:', updateResult.unwrapErr().message)
      return
    }

    console.log('✅ Session updated successfully')

    // 8. Clean up - delete session
    console.log('🗑️ Deleting session...')
    const deleteResult = await chatModule.chatApplicationService.deleteSession({
      sessionId: session.id,
      userId: 'demo-user-123'
    })

    if (deleteResult.isErr()) {
      console.error('❌ Failed to delete session:', deleteResult.unwrapErr().message)
      return
    }

    console.log('✅ Session deleted successfully')

    console.log('🎉 Chat module demonstration completed successfully!')

  } catch (error) {
    console.error('❌ Demonstration failed:', error)
  }
}

/**
 * Example: Testing different AI providers
 */
export async function testAIProviders() {
  const chatModule = createChatModule()

  // Test OpenAI
  console.log('🤖 Testing OpenAI integration...')
  const openaiSession = await chatModule.chatApplicationService.createSession({
    userId: 'test-user',
    title: 'OpenAI Test',
    aiProvider: 'openai',
    aiModel: 'gpt-3.5-turbo'
  })

  if (openaiSession.isOk()) {
    const message = await chatModule.chatApplicationService.sendMessage({
      sessionId: openaiSession.unwrap().session.id,
      content: 'Hello! This is a test message.',
      userId: 'test-user'
    })

    if (message.isOk()) {
      console.log('✅ OpenAI test successful')
    } else {
      console.log('❌ OpenAI test failed:', message.unwrapErr().message)
    }
  }

  // Test Claude
  console.log('🧠 Testing Claude integration...')
  const claudeSession = await chatModule.chatApplicationService.createSession({
    userId: 'test-user',
    title: 'Claude Test',
    aiProvider: 'claude',
    aiModel: 'claude-3-sonnet-20241022'
  })

  if (claudeSession.isOk()) {
    const message = await chatModule.chatApplicationService.sendMessage({
      sessionId: claudeSession.unwrap().session.id,
      content: 'Hello! This is a test message.',
      userId: 'test-user'
    })

    if (message.isOk()) {
      console.log('✅ Claude test successful')
    } else {
      console.log('❌ Claude test failed:', message.unwrapErr().message)
    }
  }
}

/**
 * Example: Error handling patterns
 */
export async function demonstrateErrorHandling() {
  const chatModule = createChatModule()

  // Example 1: Invalid session ID
  const invalidSessionResult = await chatModule.chatApplicationService.getSession({
    sessionId: 'invalid-session-id',
    userId: 'test-user',
    includeMessages: true
  })

  if (invalidSessionResult.isErr()) {
    console.log('✅ Properly handled invalid session error:', invalidSessionResult.unwrapErr().message)
  }

  // Example 2: Access denied
  const accessDeniedResult = await chatModule.chatApplicationService.sendMessage({
    sessionId: 'some-session-id',
    content: 'This should fail',
    userId: 'wrong-user-id'
  })

  if (accessDeniedResult.isErr()) {
    console.log('✅ Properly handled access denied error:', accessDeniedResult.unwrapErr().message)
  }

  // Example 3: Validation error
  const validationErrorResult = await chatModule.chatApplicationService.createSession({
    userId: '',
    title: 'A'.repeat(200), // Too long title
    aiProvider: 'invalid-provider' as any
  })

  if (validationErrorResult.isErr()) {
    console.log('✅ Properly handled validation error:', validationErrorResult.unwrapErr().message)
  }
}

// Export for easy import in other files
export default {
  setupChatModule,
  demonstrateChatUsage,
  testAIProviders,
  demonstrateErrorHandling
}