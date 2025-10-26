/**
 * Simple Demo Server - JavaScript version
 * Shows basic API functionality for demonstration
 */

import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

// Health check endpoint
app.get("/health", async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
  };
});

// Root endpoint
app.get("/", async () => {
  return {
    name: "AI Chat API - Demo",
    description: "AI-powered chat application",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      demo: "/demo",
    },
  };
});

// Demo authentication endpoints
app.post("/demo/auth/register", async (request, _reply) => {
  const { email, password, name } = request.body;

  return {
    success: true,
    data: {
      user: {
        id: `demo-user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      },
      message: "Registration successful! This is a demo - no data is actually stored.",
    },
  };
});

app.post("/demo/auth/login", async (request, _reply) => {
  const { email, password } = request.body;

  return {
    success: true,
    data: {
      user: {
        id: `demo-user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: "Demo User",
      },
      tokens: {
        accessToken: `demo-access-token-${Math.random().toString(36).substr(2, 20)}`,
        refreshToken: `demo-refresh-token-${Math.random().toString(36).substr(2, 20)}`,
      },
      message: "Login successful! This is a demo - tokens are not actually valid.",
    },
  };
});

// Demo CRM endpoints
app.post("/demo/crm/contacts", async (request, _reply) => {
  const { name, email, company, tags } = request.body;

  return {
    success: true,
    data: {
      id: `demo-contact-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      company,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      message: "Contact created successfully! This is a demo - no data is actually stored.",
    },
  };
});

// Demo content generation endpoints
app.post("/demo/content/generate/presentation", async (request, _reply) => {
  const { topic, audience, length, style } = request.body;

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    data: {
      id: `demo-content-${Math.random().toString(36).substr(2, 9)}`,
      type: "presentation",
      title: topic,
      status: "completed",
      content: {
        slides: [
          {
            id: 1,
            title: "Executive Summary",
            content: `This presentation on "${topic}" is designed for ${audience} with a ${style} style and ${length} length.`,
            speakerNotes: "This is a demo presentation with AI-generated content.",
          },
          {
            id: 2,
            title: "Key Points",
            content: `Main discussion points about ${topic} tailored for ${audience}.`,
            speakerNotes: "Focus on audience engagement and key takeaways.",
          },
          {
            id: 3,
            title: "Next Steps",
            content: `Action items and follow-up for ${topic} implementation.`,
            speakerNotes: "Ensure clear call-to-action and timeline.",
          },
        ],
      },
      metadata: {
        slideCount: 3,
        estimatedDuration: "15 minutes",
        readibilityScore: "A+",
        aiConfidence: 94,
        generatedAt: new Date().toISOString(),
      },
      message: "Presentation generated successfully! This is a demo with simulated AI content.",
    },
  };
});

// Demo chat endpoints
app.post("/demo/chat/sessions", async (request, _reply) => {
  const { title, context } = request.body;

  return {
    success: true,
    data: {
      id: `demo-session-${Math.random().toString(36).substr(2, 9)}`,
      title: title || "New Chat Session",
      context: context || "General conversation",
      messageCount: 0,
      createdAt: new Date().toISOString(),
      message: "Chat session created! This is a demo - no actual AI processing.",
    },
  };
});

app.post("/demo/chat/sessions/:sessionId/messages", async (request, _reply) => {
  const { content } = request.body;
  const { sessionId } = request.params;

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    data: {
      id: `demo-message-${Math.random().toString(36).substr(2, 9)}`,
      role: "assistant",
      content: `This is a demo AI response to: "${content}". In a real implementation, this would be a thoughtful response from GPT-4 or Claude AI, providing helpful information and insights based on the conversation context.`,
      model: "gpt-4-demo",
      tokensUsed: 150,
      createdAt: new Date().toISOString(),
      message: "This is a simulated AI response for demonstration purposes.",
    },
  };
});

// Demo data analysis endpoint
app.post("/demo/content/analyze/data", async (request, _reply) => {
  const { dataType, analysisType, filters } = request.body;

  // Simulate analysis time
  await new Promise(resolve => setTimeout(resolve, 3000));

  return {
    success: true,
    data: {
      id: `demo-analysis-${Math.random().toString(36).substr(2, 9)}`,
      type: `${dataType}_${analysisType}`,
      insights: [
        {
          category: "Performance Metrics",
          finding: `Based on ${dataType} analysis, performance improved by 35%`,
          impact: "High",
          recommendation: "Continue current strategy and optimize key processes",
        },
        {
          category: "Efficiency Gains",
          finding: `${analysisType} analysis revealed 40% reduction in processing time`,
          impact: "High",
          recommendation: "Implement automation to further improve efficiency",
        },
        {
          category: "Cost Optimization",
          finding: "Operational costs reduced by 25% through strategic improvements",
          impact: "Medium",
          recommendation: "Focus on scalability for continued cost benefits",
        },
      ],
      metrics: {
        totalRecords: 1250,
        dataQuality: "96%",
        confidence: 92,
        accuracy: 94,
      },
      generatedAt: new Date().toISOString(),
      message: "Analysis completed successfully! This is a demo with simulated insights.",
    },
  };
});

// Start server
const start = async () => {
  try {
    const port = Number.parseInt(process.env.PORT || "4000");
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });

    console.log("\n🚀 AI Workspace API Demo Server Started Successfully!");
    console.log(`📍 Server running at: http://${host}:${port}`);
    console.log(`🔍 Health Check: http://${host}:${port}/health`);
    console.log("🎯 Demo Endpoints:");
    console.log("   POST /demo/auth/register - Register demo user");
    console.log("   POST /demo/auth/login - Login demo user");
    console.log("   POST /demo/crm/contacts - Create demo contact");
    console.log("   POST /demo/content/generate/presentation - Generate demo presentation");
    console.log("   POST /demo/chat/sessions - Create demo chat session");
    console.log("   POST /demo/chat/sessions/:id/messages - Send demo chat message");
    console.log("   POST /demo/content/analyze/data - Analyze demo data");
    console.log("\n💡 All endpoints return demo data - no actual processing or storage occurs.");
    console.log("\n🛑 Press Ctrl+C to stop the server\n");
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  process.exit(0);
});

// Start the server
start();
