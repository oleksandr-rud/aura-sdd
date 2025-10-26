/**
 * Test App Builder
 * Helper to create Fastify app for testing
 */
import Fastify from "fastify";
export async function buildApp() {
  const app = Fastify({
    logger: false, // Disable logging for tests
  });
  // Register basic plugins if needed
  await app.register(import("@fastify/sensible"));
  return app;
}
