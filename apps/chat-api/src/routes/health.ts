import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        response: {
          200: z.object({
            status: z.literal("ok"),
            uptimeSeconds: z.number(),
            timestamp: z.string()
          })
        }
      }
    },
    async () => ({
      status: "ok",
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString()
    })
  );
};

export default healthRoutes;
