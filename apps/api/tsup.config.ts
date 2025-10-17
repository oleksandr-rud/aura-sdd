import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm", "cjs"],
  sourcemap: true,
  splitting: false,
  dts: true,
  clean: true,
  target: "es2020",
  env: {
    NODE_ENV: process.env.NODE_ENV ?? "production"
  }
});
