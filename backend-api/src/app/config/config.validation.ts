import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  BRASIL_API_BASE_URL: Joi.string()
    .uri()
    .default('https://brasilapi.com.br'),
  UPLOAD_DIR: Joi.string().default('uploads/articles'),
  MAX_PDF_BYTES: Joi.number().integer().min(1024).max(52428800).default(10485760),
});
