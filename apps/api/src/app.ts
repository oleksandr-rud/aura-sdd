import Fastify from "fastify";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import envPlugin from "./plugins/env";
import healthRoutes from "./routes/health";

export function buildServer() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug"
    }
  });

  app.register(envPlugin);
  app.register(sensible);
  app.register(swagger, {
    openapi: {
      info: {
        title: "Spec Gen API",
        version: "0.1.0"
      }
    }
  });
  app.register(swaggerUi, {
    routePrefix: "/docs"
  });

  app.register(healthRoutes, { prefix: "/health" });

  return app;
}
