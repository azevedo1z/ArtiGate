import { resolve } from 'path';

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
  brasilApi: {
    baseUrl: process.env.BRASIL_API_BASE_URL,
  },
  attachments: {
    uploadDir: resolve(
      process.cwd(),
      process.env.UPLOAD_DIR ?? 'uploads/articles'
    ),
    maxBytes: parseInt(process.env.MAX_PDF_BYTES ?? '10485760', 10),
  },
});
