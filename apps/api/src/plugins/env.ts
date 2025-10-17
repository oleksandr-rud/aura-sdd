import fp from "fastify-plugin";
import dotenv from "dotenv";
import type { FastifyInstance } from "fastify";
import { envSchema, type EnvConfig } from "../config/env";

declare module "fastify" {
  interface FastifyInstance {
    config: EnvConfig;
  }
}

function loadEnvironment(): EnvConfig {
  dotenv.config();
  return envSchema.parse(process.env);
}

async function envPlugin(app: FastifyInstance) {
  const config = loadEnvironment();
  app.decorate("config", config);
}

export default fp(envPlugin, {
  name: "env"
});
