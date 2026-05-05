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
  payment: {
    mockEnabled:
      String(process.env.ENABLE_PAYMENT_MOCK ?? 'false').toLowerCase() ===
      'true',
    defaultCurrency: process.env.PAYMENT_DEFAULT_CURRENCY ?? 'BRL',
    mercadoPago: {
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY,
      webhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
      notificationUrl: process.env.MERCADO_PAGO_NOTIFICATION_URL,
    },
  },
});
