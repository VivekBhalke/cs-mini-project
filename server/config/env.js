import dotenv from "dotenv";

dotenv.config();
export const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/odoo",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>",
};

Object.freeze(env);
