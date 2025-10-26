export const configuration = () => ({
  port: Number.parseInt(process.env.API_PORT || "4000", 10),
  host: process.env.API_HOST || "0.0.0.0",
  database: {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "chat_app",
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
})
