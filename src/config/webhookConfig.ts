
export const WEBHOOK_CONFIG = {
  AVALIACAO_URL: "https://n8n2.flowfieldsai.com/webhook/6a3f7dab-06bf-463f-906d-77e78c62d66e",
  REQUEST_TIMEOUT: 10000, // 10 segundos
  MAX_RETRIES: 3,
  RATE_LIMIT_MS: 2000, // 2 segundos
  RETRY_DELAY_BASE: 1000, // 1 segundo base para exponential backoff
} as const;

export const WEBHOOK_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'PROFZi-Webhook/1.0',
  'Accept': 'application/json',
} as const;
